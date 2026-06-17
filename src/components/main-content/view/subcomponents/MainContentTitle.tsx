import { useTranslation } from 'react-i18next';
import SessionProviderLogo from '../../../llm-logo-provider/SessionProviderLogo';
import type { AppTab, Project, ProjectSession } from '../../../../types/app';
import { usePlugins } from '../../../../contexts/PluginsContext';

type MainContentTitleProps = {
  activeTab: AppTab;
  selectedProject: Project;
  selectedSession: ProjectSession | null;
  shouldShowTasksTab: boolean;
};

function getTabTitle(activeTab: AppTab, shouldShowTasksTab: boolean, t: (key: string) => string, pluginDisplayName?: string) {
  if (activeTab.startsWith('plugin:') && pluginDisplayName) {
    return pluginDisplayName;
  }

  if (activeTab === 'files') {
    return t('mainContent.projectFiles');
  }

  if (activeTab === 'git') {
    return t('tabs.git');
  }

  if (activeTab === 'tasks' && shouldShowTasksTab) {
    return 'TaskMaster';
  }

  return 'Project';
}

function getSessionTitle(session: ProjectSession): string {
  if (session.__provider === 'cursor') {
    return (session.name as string) || 'Untitled Session';
  }

  return (session.summary as string) || 'New Session';
}

export default function MainContentTitle({
  activeTab,
  selectedProject,
  selectedSession,
  shouldShowTasksTab,
}: MainContentTitleProps) {
  const { t } = useTranslation();
  const { plugins } = usePlugins();

  const pluginDisplayName = activeTab.startsWith('plugin:')
    ? plugins.find((p) => p.name === activeTab.replace('plugin:', ''))?.displayName
    : undefined;

  const showSessionIcon = activeTab === 'chat' && Boolean(selectedSession);
  const showChatNewSession = activeTab === 'chat' && !selectedSession;

  return (
    <div className="scrollbar-hide flex min-w-0 flex-1 items-center gap-2.5 overflow-x-auto">
      {showSessionIcon && (
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/40 ring-1 ring-violet-200 dark:ring-violet-800">
          <SessionProviderLogo provider={selectedSession?.__provider} className="h-4 w-4" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        {activeTab === 'chat' && selectedSession ? (
          <div className="min-w-0">
            {/* Session title */}
            <h2 className="scrollbar-hide overflow-x-auto whitespace-nowrap text-[15px] font-bold leading-snug tracking-tight text-foreground">
              {getSessionTitle(selectedSession)}
            </h2>
            {/* Project sub-label */}
            <div className="mt-0.5 flex items-center gap-1.5 truncate">
              <span className="h-2 w-2 flex-shrink-0 rounded-full bg-teal-500 dark:bg-teal-400" />
              <span className="truncate text-xs font-semibold leading-tight text-slate-500 dark:text-slate-400">
                {selectedProject.displayName}
              </span>
            </div>
          </div>
        ) : showChatNewSession ? (
          <div className="min-w-0">
            <h2 className="text-[15px] font-bold leading-snug tracking-tight text-foreground">
              {t('mainContent.newSession')}
            </h2>
            <div className="mt-0.5 flex items-center gap-1.5 truncate">
              <span className="h-2 w-2 flex-shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" />
              <span className="truncate text-xs font-semibold leading-tight text-slate-500 dark:text-slate-400">
                {selectedProject.displayName}
              </span>
            </div>
          </div>
        ) : (
          <div className="min-w-0">
            {/* Section title — e.g. "Project Files", "Source Control" */}
            <h2 className="text-[15px] font-bold leading-snug tracking-tight text-foreground">
              {getTabTitle(activeTab, shouldShowTasksTab, t, pluginDisplayName)}
            </h2>
            {/* Project name — clearly readable, not italic/thin */}
            <div className="mt-0.5 flex items-center gap-1.5 truncate">
              <span className="h-2 w-2 flex-shrink-0 rounded-full bg-amber-400 dark:bg-amber-500" />
              <span className="truncate text-xs font-semibold leading-tight text-slate-600 dark:text-slate-300">
                {selectedProject.displayName}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

