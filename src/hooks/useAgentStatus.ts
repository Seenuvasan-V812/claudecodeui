import { useCallback, useEffect, useRef, useState } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';
import type { LLMProvider } from '../types/app';

export type AgentStatusType = 'idle' | 'running' | 'waiting_permission' | 'complete' | 'error';

export interface AgentStatusState {
  status: AgentStatusType;
  statusText: string;
  toolName: string | null;
  input: any;
  sessionId: string | null;
  provider: LLMProvider | null;
}

const getToolFriendlyAction = (toolName: string): string => {
  const name = toolName.toLowerCase();
  if (name.includes('bash') || name === 'run_command' || name === 'send_command_input') {
    return 'Running command';
  }
  if (
    name === 'read' ||
    name === 'view' ||
    name === 'view_file' ||
    name === 'read_url_content' ||
    name === 'grep_search' ||
    name === 'list_dir'
  ) {
    return 'Reading files';
  }
  if (
    name === 'write' ||
    name === 'edit' ||
    name === 'replace' ||
    name === 'write_to_file' ||
    name === 'replace_file_content' ||
    name === 'multi_replace_file_content'
  ) {
    return 'Writing files';
  }
  if (name.includes('search') || name === 'search_web') {
    return 'Searching';
  }
  if (name.includes('image') || name === 'generate_image') {
    return 'Generating image';
  }
  if (name === 'askuserquestion') {
    return 'Awaiting input';
  }
  return `Running ${toolName}`;
};

export function useAgentStatus(selectedSessionId?: string | null, selectedProvider?: LLMProvider | null) {
  const { latestMessage, isConnected, sendMessage } = useWebSocket();
  const [agentState, setAgentState] = useState<AgentStatusState>({
    status: 'idle',
    statusText: 'Agent is idle',
    toolName: null,
    input: null,
    sessionId: null,
    provider: null,
  });

  const lastProcessedMessageRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearResetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const scheduleReset = (delay: number, finalStatus: AgentStatusType = 'idle', finalText: string = 'Agent is idle') => {
    clearResetTimeout();
    timeoutRef.current = setTimeout(() => {
      setAgentState((prev) => ({
        ...prev,
        status: finalStatus,
        statusText: finalText,
        toolName: null,
        input: null,
      }));
    }, delay);
  };

  // Poll or query active sessions on connect
  useEffect(() => {
    if (isConnected) {
      sendMessage({ type: 'get-active-sessions' });
    }
  }, [isConnected, sendMessage]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!latestMessage) return;
    if (lastProcessedMessageRef.current === latestMessage) return;
    lastProcessedMessageRef.current = latestMessage;

    const msg = latestMessage as any;
    const msgSessionId = msg.sessionId || msg.session_id || null;
    const msgProvider = msg.provider || null;

    // 1. Handle legacy or specific structural WebSocket types first
    if (!msg.kind) {
      const messageType = String(msg.type || '');
      
      if (messageType === 'active-sessions') {
        const sessions = msg.sessions || {};
        // Find if there is any active session in any provider
        let activeSessionId: string | null = null;
        let activeProvider: LLMProvider | null = null;

        for (const [providerKey, sessionList] of Object.entries(sessions)) {
          if (Array.isArray(sessionList) && sessionList.length > 0) {
            activeSessionId = sessionList[0];
            activeProvider = providerKey as LLMProvider;
            break;
          }
        }

        if (activeSessionId && agentState.status === 'idle') {
          clearResetTimeout();
          setAgentState({
            status: 'running',
            statusText: 'Agent is active in background',
            toolName: null,
            input: null,
            sessionId: activeSessionId,
            provider: activeProvider,
          });
        }
        return;
      }

      if (messageType === 'session-status') {
        const isProcessing = Boolean(msg.isProcessing);
        if (isProcessing) {
          clearResetTimeout();
          setAgentState((prev) => ({
            ...prev,
            status: 'running',
            statusText: prev.statusText === 'Agent is idle' ? 'Agent is active' : prev.statusText,
            sessionId: msgSessionId || prev.sessionId,
            provider: msgProvider || prev.provider,
          }));
        } else if (msgSessionId === agentState.sessionId) {
          scheduleReset(1000);
        }
        return;
      }

      return;
    }

    // 2. Handle standard NormalizedMessage kind events
    switch (msg.kind) {
      case 'session_created':
        clearResetTimeout();
        setAgentState({
          status: 'running',
          statusText: 'Initializing session...',
          toolName: null,
          input: null,
          sessionId: msg.newSessionId || msgSessionId,
          provider: msgProvider,
        });
        break;

      case 'thinking':
        clearResetTimeout();
        setAgentState((prev) => ({
          status: 'running',
          statusText: 'Thinking...',
          toolName: null,
          input: null,
          sessionId: msgSessionId || prev.sessionId,
          provider: msgProvider || prev.provider,
        }));
        break;

      case 'stream_delta':
        clearResetTimeout();
        setAgentState((prev) => ({
          ...prev,
          status: 'running',
          statusText: 'Generating response...',
          sessionId: msgSessionId || prev.sessionId,
          provider: msgProvider || prev.provider,
        }));
        break;

      case 'status':
        if (msg.text === 'token_budget') break;
        if (msg.text) {
          clearResetTimeout();
          setAgentState((prev) => ({
            status: 'running',
            statusText: msg.text,
            toolName: null,
            input: null,
            sessionId: msgSessionId || prev.sessionId,
            provider: msgProvider || prev.provider,
          }));
        }
        break;

      case 'tool_use':
        if (msg.toolName) {
          clearResetTimeout();
          const actionText = getToolFriendlyAction(msg.toolName);
          setAgentState((prev) => ({
            status: 'running',
            statusText: actionText,
            toolName: msg.toolName,
            input: msg.input || null,
            sessionId: msgSessionId || prev.sessionId,
            provider: msgProvider || prev.provider,
          }));
        }
        break;

      case 'permission_request':
        if (msg.toolName) {
          clearResetTimeout();
          const actionText = getToolFriendlyAction(msg.toolName);
          setAgentState((prev) => ({
            status: 'waiting_permission',
            statusText: `${actionText} (Requires approval)`,
            toolName: msg.toolName,
            input: msg.input || null,
            sessionId: msgSessionId || prev.sessionId,
            provider: msgProvider || prev.provider,
          }));
        }
        break;

      case 'permission_cancelled':
        clearResetTimeout();
        setAgentState((prev) => ({
          ...prev,
          status: 'running',
          statusText: 'Permission cancelled',
          toolName: null,
          input: null,
        }));
        break;

      case 'complete':
        clearResetTimeout();
        setAgentState((prev) => ({
          ...prev,
          status: 'complete',
          statusText: msg.aborted ? 'Task cancelled' : 'Task completed',
          toolName: null,
          input: null,
        }));
        scheduleReset(3000);
        break;

      case 'error':
        clearResetTimeout();
        setAgentState((prev) => ({
          ...prev,
          status: 'error',
          statusText: msg.content || 'An error occurred',
          toolName: null,
          input: null,
        }));
        scheduleReset(5000);
        break;

      default:
        break;
    }
  }, [latestMessage, agentState.status, agentState.sessionId]);

  const abortActiveSession = useCallback(() => {
    const targetSessionId = agentState.sessionId || selectedSessionId;
    const targetProvider = agentState.provider || selectedProvider || 'claude';
    
    if (targetSessionId) {
      sendMessage({
        type: 'abort-session',
        sessionId: targetSessionId,
        provider: targetProvider,
      });
      setAgentState((prev) => ({
        ...prev,
        status: 'running',
        statusText: 'Cancelling task...',
      }));
    }
  }, [agentState.sessionId, agentState.provider, selectedSessionId, selectedProvider, sendMessage]);

  const isCurrentSession = Boolean(
    agentState.sessionId &&
    selectedSessionId &&
    agentState.sessionId === selectedSessionId
  );

  return {
    ...agentState,
    isConnected,
    isCurrentSession,
    abortActiveSession,
  };
}
