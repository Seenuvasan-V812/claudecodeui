import { Archive, Folder, FolderPlus, MessageSquare, Plus, RefreshCw, Search, X, PanelLeftClose } from 'lucide-react';
import type { TFunction } from 'i18next';
import { Button, Input, Tooltip } from '../../../../shared/view/ui';
import { IS_PLATFORM } from '../../../../constants/config';
import { cn } from '../../../../lib/utils';
import type { SidebarSearchMode } from '../../types/types';
import GitHubStarBadge from './GitHubStarBadge';

const MOD_KEY =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl';

type SidebarHeaderProps = {
  isPWA: boolean;
  isMobile: boolean;
  isLoading: boolean;
  projectsCount: number;
  archivedSessionsCount: number;
  isArchivedSessionsLoading: boolean;
  searchFilter: string;
  onSearchFilterChange: (value: string) => void;
  onClearSearchFilter: () => void;
  searchMode: SidebarSearchMode;
  onSearchModeChange: (mode: SidebarSearchMode) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onCreateProject: () => void;
  onCollapseSidebar: () => void;
  t: TFunction;
};

export default function SidebarHeader({
  isPWA,
  isMobile,
  isLoading,
  projectsCount,
  archivedSessionsCount,
  isArchivedSessionsLoading,
  searchFilter,
  onSearchFilterChange,
  onClearSearchFilter,
  searchMode,
  onSearchModeChange,
  onRefresh,
  isRefreshing,
  onCreateProject,
  onCollapseSidebar,
  t,
}: SidebarHeaderProps) {
  const showSearchTools = (projectsCount > 0 || archivedSessionsCount > 0 || isArchivedSessionsLoading) && !isLoading;
  const searchPlaceholder = searchMode === 'conversations'
    ? t('search.conversationsPlaceholder')
    : searchMode === 'archived'
      ? t('search.archivedPlaceholder', 'Search archived sessions...')
      : t('projects.searchPlaceholder');

  const LogoBlock = () => (
    <div className="flex min-w-0 items-center gap-2.5">
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary/90 shadow-sm">
        <svg className="h-3.5 w-3.5 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <h1 className="truncate text-sm font-semibold tracking-tight text-foreground">{t('app.title')}</h1>
    </div>
  );

  return (
    <div className="flex-shrink-0">
      {/* Desktop header */}
      <div
        className="hidden px-3 pb-2 pt-3 md:block"
        style={{}}
      >
        <div className="flex items-center justify-between gap-2">
          {IS_PLATFORM ? (
            <a
              href="https://cloudcli.ai/dashboard"
              className="flex min-w-0 items-center gap-2.5 transition-opacity hover:opacity-80"
              title={t('tooltips.viewEnvironments')}
            >
              <LogoBlock />
            </a>
          ) : (
            <LogoBlock />
          )}

          <div className="flex flex-shrink-0 items-center gap-0.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 rounded-lg p-0 text-muted-foreground hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 hover:text-foreground"
              onClick={onRefresh}
              disabled={isRefreshing}
              title={t('tooltips.refresh')}
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 rounded-lg p-0 text-muted-foreground hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 hover:text-foreground"
              onClick={onCollapseSidebar}
              title={t('tooltips.hideSidebar')}
            >
              <PanelLeftClose className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <GitHubStarBadge />

        {/* Prominent Create Project Button */}
        <div className="mt-3">
          <Button
            onClick={onCreateProject}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-indigo-500/15 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] transition-all duration-200 px-4 py-2.5 text-sm font-semibold border-0"
          >
            <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
            <span>{t('createProject', { ns: 'sidebar' })}</span>
          </Button>
        </div>

        {/* Search bar */}
        {showSearchTools && (
          <div className="mt-3.5 space-y-2">
            {/* Search mode toggle */}
            <div className="flex rounded-xl bg-zinc-200/50 dark:bg-zinc-900/50 p-0.5 border border-zinc-200/10 dark:border-zinc-800/20">
              <button
                onClick={() => onSearchModeChange('projects')}
                aria-pressed={searchMode === 'projects'}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-all",
                  searchMode === 'projects'
                    ? "bg-white dark:bg-zinc-800 shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/10 dark:hover:bg-zinc-800/10"
                )}
              >
                <Folder className="h-3 w-3" />
                {t('search.modeProjects')}
              </button>
              <button
                onClick={() => onSearchModeChange('conversations')}
                aria-pressed={searchMode === 'conversations'}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-all",
                  searchMode === 'conversations'
                    ? "bg-white dark:bg-zinc-800 shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/10 dark:hover:bg-zinc-800/10"
                )}
              >
                <MessageSquare className="h-3 w-3" />
                {t('search.modeConversations')}
              </button>
              <Tooltip content={t('search.archiveOnlyTooltip', 'Archive only')} position="top">
                <button
                  onClick={() => onSearchModeChange('archived')}
                  aria-pressed={searchMode === 'archived'}
                  aria-label={t('search.archiveOnlyTooltip', 'Archive only')}
                  title={t('search.archiveOnlyTooltip', 'Archive only')}
                  className={cn(
                    "flex items-center justify-center rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all",
                    searchMode === 'archived'
                      ? "bg-white dark:bg-zinc-800 shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/10 dark:hover:bg-zinc-800/10"
                  )}
                >
                  <Archive className="h-3 w-3" />
                </button>
              </Tooltip>
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchFilter}
                onChange={(event) => onSearchFilterChange(event.target.value)}
                className="nav-search-input h-9.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-100/50 dark:bg-zinc-900/30 pl-9 pr-14 text-sm transition-all duration-200 placeholder:text-muted-foreground/45 focus-visible:border-indigo-500/50 focus-visible:ring-1 focus-visible:ring-indigo-500/20 focus-visible:ring-offset-0"
              />
              {searchFilter ? (
                <button
                  onClick={onClearSearchFilter}
                  aria-label={t('tooltips.clearSearch')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 hover:bg-accent"
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              ) : (
                <kbd
                  aria-hidden
                  title={t('tooltips.openCommandPalette')}
                  className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded border border-border/60 bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground md:inline-flex"
                >
                  {MOD_KEY}
                  <span>K</span>
                </kbd>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Desktop divider */}
      <div className="nav-divider hidden md:block" />

      {/* Mobile header */}
      <div
        className="p-3 pb-2 md:hidden"
        style={isPWA && isMobile ? { paddingTop: '16px' } : {}}
      >
        <div className="flex items-center justify-between">
          {IS_PLATFORM ? (
            <a
              href="https://cloudcli.ai/dashboard"
              className="flex min-w-0 items-center gap-2.5 transition-opacity active:opacity-70"
              title={t('tooltips.viewEnvironments')}
            >
              <LogoBlock />
            </a>
          ) : (
            <LogoBlock />
          )}

          <div className="flex flex-shrink-0 gap-1.5">
            <button
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-200/50 dark:bg-zinc-800/50 transition-all active:scale-95"
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 text-muted-foreground ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-200/50 dark:bg-zinc-800/50 transition-all active:scale-95"
              onClick={onCollapseSidebar}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Prominent Create Project Button on Mobile */}
        <div className="mt-3">
          <Button
            onClick={onCreateProject}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-indigo-500/15 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] transition-all duration-200 px-4 py-2.5 text-sm font-semibold border-0"
          >
            <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
            <span>{t('createProject', { ns: 'sidebar' })}</span>
          </Button>
        </div>

        {/* Mobile search */}
        {showSearchTools && (
          <div className="mt-3.5 space-y-2">
            <div className="flex rounded-xl bg-zinc-200/50 dark:bg-zinc-900/50 p-0.5 border border-zinc-200/10 dark:border-zinc-800/20">
              <button
                onClick={() => onSearchModeChange('projects')}
                aria-pressed={searchMode === 'projects'}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-all",
                  searchMode === 'projects'
                    ? "bg-white dark:bg-zinc-800 shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/10 dark:hover:bg-zinc-800/10"
                )}
              >
                <Folder className="h-3 w-3" />
                {t('search.modeProjects')}
              </button>
              <button
                onClick={() => onSearchModeChange('conversations')}
                aria-pressed={searchMode === 'conversations'}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-all",
                  searchMode === 'conversations'
                    ? "bg-white dark:bg-zinc-800 shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/10 dark:hover:bg-zinc-800/10"
                )}
              >
                <MessageSquare className="h-3 w-3" />
                {t('search.modeConversations')}
              </button>
              <Tooltip content={t('search.archiveOnlyTooltip', 'Archive only')} position="top">
                <button
                  onClick={() => onSearchModeChange('archived')}
                  aria-pressed={searchMode === 'archived'}
                  aria-label={t('search.archiveOnlyTooltip', 'Archive only')}
                  title={t('search.archiveOnlyTooltip', 'Archive only')}
                  className={cn(
                    "flex items-center justify-center rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all",
                    searchMode === 'archived'
                      ? "bg-white dark:bg-zinc-800 shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/10 dark:hover:bg-zinc-800/10"
                  )}
                >
                  <Archive className="h-3 w-3" />
                </button>
              </Tooltip>
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchFilter}
                onChange={(event) => onSearchFilterChange(event.target.value)}
                className="nav-search-input h-10 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-100/50 dark:bg-zinc-900/30 pl-10 pr-9 text-sm transition-all duration-200 placeholder:text-muted-foreground/45 focus-visible:border-indigo-500/50 focus-visible:ring-1 focus-visible:ring-indigo-500/20 focus-visible:ring-offset-0"
              />
              {searchFilter && (
                <button
                  onClick={onClearSearchFilter}
                  aria-label={t('tooltips.clearSearch')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 hover:bg-accent"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile divider */}
      <div className="nav-divider md:hidden" />
    </div>
  );
}
