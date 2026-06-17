import {
  MessageSquare,
  Terminal,
  Folder,
  GitBranch,
  ClipboardCheck,
  type LucideIcon,
} from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip, PillBar, Pill } from '../../../../shared/view/ui';
import type { AppTab } from '../../../../types/app';
import { usePlugins } from '../../../../contexts/PluginsContext';
import PluginIcon from '../../../plugins/view/PluginIcon';

type MainContentTabSwitcherProps = {
  activeTab: AppTab;
  setActiveTab: Dispatch<SetStateAction<AppTab>>;
  shouldShowTasksTab: boolean;
};

type BuiltInTab = {
  kind: 'builtin';
  id: AppTab;
  labelKey: string;
  icon: LucideIcon;
  /** Tailwind text-color class applied to the icon when the tab is inactive */
  iconColor: string;
  /** Tailwind text-color class applied to the icon + label when active */
  activeColor: string;
};

type PluginTab = {
  kind: 'plugin';
  id: AppTab;
  label: string;
  pluginName: string;
  iconFile: string;
};

type TabDefinition = BuiltInTab | PluginTab;

const BASE_TABS: BuiltInTab[] = [
  {
    kind: 'builtin',
    id: 'chat',
    labelKey: 'tabs.chat',
    icon: MessageSquare,
    iconColor: 'text-violet-500',
    activeColor: 'text-violet-600 dark:text-violet-400',
  },
  {
    kind: 'builtin',
    id: 'shell',
    labelKey: 'tabs.shell',
    icon: Terminal,
    iconColor: 'text-emerald-500',
    activeColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    kind: 'builtin',
    id: 'files',
    labelKey: 'tabs.files',
    icon: Folder,
    iconColor: 'text-amber-500',
    activeColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    kind: 'builtin',
    id: 'git',
    labelKey: 'tabs.git',
    icon: GitBranch,
    iconColor: 'text-rose-500',
    activeColor: 'text-rose-600 dark:text-rose-400',
  },
];

const TASKS_TAB: BuiltInTab = {
  kind: 'builtin',
  id: 'tasks',
  labelKey: 'tabs.tasks',
  icon: ClipboardCheck,
  iconColor: 'text-sky-500',
  activeColor: 'text-sky-600 dark:text-sky-400',
};

export default function MainContentTabSwitcher({
  activeTab,
  setActiveTab,
  shouldShowTasksTab,
}: MainContentTabSwitcherProps) {
  const { t } = useTranslation();
  const { plugins } = usePlugins();

  const builtInTabs: BuiltInTab[] = shouldShowTasksTab ? [...BASE_TABS, TASKS_TAB] : BASE_TABS;

  const pluginTabs: PluginTab[] = plugins
    .filter((p) => p.enabled)
    .map((p) => ({
      kind: 'plugin',
      id: `plugin:${p.name}` as AppTab,
      label: p.displayName,
      pluginName: p.name,
      iconFile: p.icon,
    }));

  const tabs: TabDefinition[] = [...builtInTabs, ...pluginTabs];

  return (
    <PillBar>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        const displayLabel = tab.kind === 'builtin' ? t(tab.labelKey) : tab.label;
        const iconColor = tab.kind === 'builtin'
          ? (isActive ? tab.activeColor : tab.iconColor)
          : '';

        return (
          <Tooltip key={tab.id} content={displayLabel} position="bottom">
            <Pill
              isActive={isActive}
              onClick={() => setActiveTab(tab.id)}
              className="px-3 py-1.5"
            >
              {tab.kind === 'builtin' ? (
                <tab.icon
                  className={`h-4 w-4 flex-shrink-0 transition-colors duration-150 ${iconColor}`}
                  strokeWidth={isActive ? 2.4 : 1.8}
                />
              ) : (
                <PluginIcon
                  pluginName={tab.pluginName}
                  iconFile={tab.iconFile}
                  className="flex h-4 w-4 flex-shrink-0 items-center justify-center [&>svg]:h-full [&>svg]:w-full"
                />
              )}
              {/* Label: always shown on sm+, bold + colored when active */}
              <span
                className={`hidden sm:inline text-xs transition-colors duration-150 ${
                  isActive
                    ? `font-bold ${tab.kind === 'builtin' ? tab.activeColor : 'text-foreground'}`
                    : 'font-medium text-muted-foreground'
                }`}
              >
                {displayLabel}
              </span>
            </Pill>
          </Tooltip>
        );
      })}
    </PillBar>
  );
}
