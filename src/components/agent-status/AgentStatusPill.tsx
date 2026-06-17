import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAgentStatus } from '../../hooks/useAgentStatus';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Square,
  Eye,
  Terminal,
  FileCode,
  Search,
  Image as ImageIcon,
  HelpCircle,
  Cpu,
} from 'lucide-react';

export const AgentStatusPill: React.FC = () => {
  const navigate = useNavigate();
  const { sessionId: routeSessionId } = useParams<{ sessionId?: string }>();
  const [isHovered, setIsHovered] = useState(false);

  const {
    status,
    statusText,
    toolName,
    input,
    sessionId,
    provider,
    isConnected,
    isCurrentSession,
    abortActiveSession,
  } = useAgentStatus(routeSessionId, null);

  // Keep track of the last non-idle status and session details to avoid text/icon flickers during exit transition
  const [lastActiveState, setLastActiveState] = useState<{
    status: typeof status;
    statusText: string;
    toolName: string | null;
    input: any;
    sessionId: string | null;
    provider: typeof provider;
  } | null>(null);

  useEffect(() => {
    if (status !== 'idle' && sessionId) {
      setLastActiveState({
        status,
        statusText,
        toolName,
        input,
        sessionId,
        provider,
      });
    }
  }, [status, statusText, toolName, input, sessionId, provider]);

  // Determine visibility
  const isVisible = isConnected && status !== 'idle' && !!sessionId;

  // If we have never had any active state, don't render anything in the DOM
  if (!lastActiveState) {
    return null;
  }

  // Destructure from last active state to preserve text/styling during exit transitions
  const displayStatus = isVisible ? status : lastActiveState.status;
  const displayStatusText = isVisible ? statusText : lastActiveState.statusText;
  const displayToolName = isVisible ? toolName : lastActiveState.toolName;
  const displayInput = isVisible ? input : lastActiveState.input;
  const displaySessionId = isVisible ? sessionId : lastActiveState.sessionId;
  const displayProvider = isVisible ? provider : lastActiveState.provider;

  // Map provider to brand styling colors (for tag or highlights)
  const getProviderColorClass = () => {
    switch (displayProvider) {
      case 'claude':
        return 'text-amber-500 dark:text-amber-400';
      case 'gemini':
        return 'text-blue-500 dark:text-blue-400';
      case 'cursor':
        return 'text-indigo-500 dark:text-indigo-400';
      case 'codex':
      case 'opencode':
        return 'text-teal-500 dark:text-teal-400';
      default:
        return 'text-zinc-500';
    }
  };

  // Truncate text utility
  const truncateText = (text: string, length = 40) => {
    if (!text) return '';
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };

  // Get input details for the hover tooltip based on active tool type
  const getTooltipContent = () => {
    if (!displayToolName || !displayInput) return null;
    const name = displayToolName.toLowerCase();
    
    if (name.includes('bash') || name === 'run_command' || name === 'send_command_input') {
      const cmd = displayInput.command || displayInput.CommandLine || (typeof displayInput === 'string' ? displayInput : '');
      return {
        type: 'Terminal Command',
        icon: <Terminal className="h-3.5 w-3.5 text-zinc-400" />,
        text: cmd ? `$ ${cmd}` : 'Running command...',
      };
    }
    
    if (
      name.includes('file') || 
      name.includes('content') || 
      name === 'write_to_file' || 
      name === 'replace_file_content' || 
      name === 'multi_replace_file_content' ||
      name === 'view_file' ||
      name === 'read_file'
    ) {
      const file = displayInput.TargetFile || displayInput.AbsolutePath || displayInput.path || displayInput.filePath || '';
      const action = name.includes('write') || name.includes('replace') ? 'Writing' : 'Reading';
      return {
        type: `${action} File`,
        icon: <FileCode className="h-3.5 w-3.5 text-zinc-400" />,
        text: file ? `${file.split(/[\\/]/).pop()}` : 'Accessing file...',
      };
    }

    if (name.includes('search') || name === 'search_web') {
      const query = displayInput.query || (typeof displayInput === 'string' ? displayInput : '');
      return {
        type: 'Web Search',
        icon: <Search className="h-3.5 w-3.5 text-zinc-400" />,
        text: query ? `"${query}"` : 'Searching the web...',
      };
    }

    if (name.includes('image') || name === 'generate_image') {
      const prompt = displayInput.Prompt || displayInput.prompt || '';
      return {
        type: 'Image Generation',
        icon: <ImageIcon className="h-3.5 w-3.5 text-zinc-400" />,
        text: prompt ? `"${prompt}"` : 'Generating design asset...',
      };
    }

    if (name === 'ask_permission' || name === 'ask_question' || name === 'askuserquestion') {
      return {
        type: 'User Clarification',
        icon: <HelpCircle className="h-3.5 w-3.5 text-zinc-400" />,
        text: 'Awaiting your response...',
      };
    }

    return {
      type: 'Tool Execution',
      icon: <Cpu className="h-3.5 w-3.5 text-zinc-400" />,
      text: `Running ${displayToolName}`,
    };
  };

  const tooltipData = getTooltipContent();

  // Map state to colors, shadows, and glow animations
  let glowColor = '#3b82f6'; // Default blue glow
  let glowClass = 'shadow-[0_0_20px_rgba(59,130,246,0.15)] dark:shadow-[0_0_25px_rgba(59,130,246,0.1)]';
  let pulseBorderClass = '';
  
  // Custom custom loader components
  let iconComponent = (
    <div className="relative flex items-center justify-center h-5 w-5">
      <div className="absolute inset-0 rounded-full border border-zinc-200 dark:border-zinc-800" />
      <div className="absolute inset-0 rounded-full border-t border-t-blue-500 animate-spin" />
      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
    </div>
  );

  switch (displayStatus) {
    case 'waiting_permission':
      glowColor = '#f59e0b'; // Amber
      glowClass = 'shadow-[0_0_25px_rgba(245,158,11,0.25)] dark:shadow-[0_0_30px_rgba(245,158,11,0.15)]';
      pulseBorderClass = 'animate-[pulse_2s_infinite]';
      iconComponent = (
        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-amber-500/10 dark:bg-amber-500/20">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400 animate-bounce" />
        </div>
      );
      break;
    case 'complete':
      glowColor = '#10b981'; // Emerald
      glowClass = 'shadow-[0_0_25px_rgba(16,185,129,0.25)] dark:shadow-[0_0_30px_rgba(16,185,129,0.15)]';
      iconComponent = (
        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/15">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
        </div>
      );
      break;
    case 'error':
      glowColor = '#ef4444'; // Rose/Red
      glowClass = 'shadow-[0_0_25px_rgba(239,68,68,0.25)] dark:shadow-[0_0_30px_rgba(239,68,68,0.15)]';
      iconComponent = (
        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-rose-500/15">
          <AlertTriangle className="h-3.5 w-3.5 text-rose-500 dark:text-rose-400 animate-pulse" />
        </div>
      );
      break;
    default:
      // running / active
      glowColor = '#06b6d4'; // Cyan/Teal glow for standard execution
      glowClass = 'shadow-[0_0_20px_rgba(6,182,212,0.2)] dark:shadow-[0_0_30px_rgba(6,182,212,0.12)]';
      iconComponent = (
        <div className="relative flex items-center justify-center h-5 w-5">
          <div className="absolute inset-0 rounded-full border border-cyan-500/20" />
          <div className="absolute inset-0 rounded-full border border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
        </div>
      );
      break;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[100]">
      <div
        className={`flex flex-col items-center gap-2.5 transition-all duration-500 ease-out transform ${
          isVisible 
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' 
            : 'opacity-0 translate-y-6 scale-90 pointer-events-none'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Tooltip detail card above the main pill */}
        {isHovered && tooltipData && (
          <div className="mb-0.5 transform scale-100 opacity-100 transition-all duration-300 pointer-events-auto flex flex-col gap-1 w-64 bg-zinc-900/90 dark:bg-zinc-950/90 backdrop-blur-md text-zinc-100 py-2.5 px-3.5 rounded-xl border border-zinc-800/80 shadow-xl">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
              {tooltipData.icon}
              <span>{tooltipData.type}</span>
            </div>
            <span className="text-xs font-mono text-zinc-200 break-all leading-normal whitespace-pre-wrap">
              {truncateText(tooltipData.text, 80)}
            </span>
          </div>
        )}

        {/* Main Glassmorphic Pill Container */}
        <div
          className={`relative rounded-[20px] p-[1.5px] overflow-hidden ${glowClass} ${pulseBorderClass} transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl w-auto max-w-[280px] sm:max-w-sm md:max-w-md`}
        >
          {/* Rotating gradient glowing border */}
          <div
            className="absolute inset-[-200%] animate-[spin_4.5s_linear_infinite]"
            style={{
              background: `conic-gradient(from 0deg, transparent 35%, ${glowColor} 50%, transparent 65%)`,
            }}
          />

          {/* The glassmorphic inner body */}
          <div className="relative z-10 flex items-start gap-3 py-3 px-4 rounded-[18.5px] bg-white/80 dark:bg-zinc-950/85 backdrop-blur-xl border border-white/20 dark:border-zinc-900/40 w-full h-auto">
            
            {/* State Icon / Loading spinner */}
            <div className="flex-shrink-0 flex items-center justify-center mt-0.5">
              {iconComponent}
            </div>

            {/* Status Text & Provider tag */}
            <div className="flex-1 min-w-0 flex flex-col">
              <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-100 whitespace-normal break-words leading-normal transition-colors duration-200 text-left">
                {displayStatusText}
              </span>
              <span className="flex items-center gap-1 mt-1.5 leading-none text-[10px]">
                <span className={`font-medium capitalize ${getProviderColorClass()}`}>
                  {displayProvider}
                </span>
                {!isCurrentSession && (
                  <>
                    <span className="text-zinc-300 dark:text-zinc-700">•</span>
                    <span className="text-zinc-500 dark:text-zinc-400">Background</span>
                  </>
                )}
              </span>
            </div>

            {/* Action button container */}
            <div className="flex-shrink-0 flex items-center gap-1 pl-2.5 mt-0.5 border-l border-zinc-200/50 dark:border-zinc-800/50 self-start">
              {/* Stops the active session */}
              {(displayStatus === 'running' || displayStatus === 'waiting_permission') && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    abortActiveSession();
                  }}
                  className="flex items-center justify-center h-6 w-6 rounded-full text-zinc-400 dark:text-zinc-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-500/10 dark:hover:bg-rose-500/15 active:scale-90 transition-all duration-150"
                  title="Stop execution"
                >
                  <Square className="h-2.5 w-2.5 fill-current" />
                </button>
              )}

              {/* Navigates to the session in the background */}
              {!isCurrentSession && displaySessionId && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/session/${displaySessionId}`);
                  }}
                  className="flex items-center justify-center h-6 w-6 rounded-full text-zinc-400 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 active:scale-90 transition-all duration-150"
                  title="Switch to active session"
                >
                  <Eye className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
