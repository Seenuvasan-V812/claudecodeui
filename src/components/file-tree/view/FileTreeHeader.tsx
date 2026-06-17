import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import {
  ChevronDown,
  Eye,
  FileText,
  FolderPlus,
  List,
  Loader2,
  RefreshCw,
  Search,
  TableProperties,
  Upload,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button, Input } from '../../../shared/view/ui';
import { cn } from '../../../lib/utils';
import { MAX_FILE_UPLOAD_SIZE_LABEL } from '../constants/constants';
import type { FileTreeViewMode } from '../types/types';

type FileTreeHeaderProps = {
  viewMode: FileTreeViewMode;
  onViewModeChange: (mode: FileTreeViewMode) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  // Toolbar actions
  onNewFile?: () => void;
  onNewFolder?: () => void;
  onUploadFiles?: (files: FileList) => void;
  onRefresh?: () => void;
  onCollapseAll?: () => void;
  // Loading state
  loading?: boolean;
  operationLoading?: boolean;
  isUploading?: boolean;
  uploadProgress?: number | null;
};

/** Compact 28×28 icon button with tooltip */
function ToolbarButton({
  label,
  onClick,
  disabled,
  isActive,
  children,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  isActive?: boolean;
  children: React.ReactNode;
}) {
  const [showTip, setShowTip] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
        onFocus={() => setShowTip(true)}
        onBlur={() => setShowTip(false)}
        className={cn(
          'flex h-7 w-7 items-center justify-center rounded-md transition-colors duration-150',
          isActive
            ? 'bg-teal-600 text-white dark:bg-teal-500'
            : 'text-muted-foreground hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-700',
          disabled && 'cursor-not-allowed opacity-40',
        )}
      >
        {children}
      </button>

      {/* Tooltip */}
      {showTip && (
        <div
          className="pointer-events-none absolute left-1/2 top-full z-50 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-[11px] font-medium text-popover-foreground shadow-md"
          role="tooltip"
        >
          {label}
        </div>
      )}
    </div>
  );
}

export default function FileTreeHeader({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchQueryChange,
  onNewFile,
  onNewFolder,
  onUploadFiles,
  onRefresh,
  onCollapseAll,
  loading,
  operationLoading,
  isUploading,
  uploadProgress,
}: FileTreeHeaderProps) {
  const { t } = useTranslation();
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const handleUploadInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && files.length > 0) {
      onUploadFiles?.(files);
    }
    event.target.value = '';
  };

  return (
    <div className="space-y-2 border-b border-border/60 bg-background px-3 pb-2 pt-3">
      {/* ── Title + compact toolbar ── */}
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          {t('fileTree.files')}
        </h3>

        <div className="flex items-center gap-0.5">
          {/* Upload */}
          {onUploadFiles && (
            <>
              <input
                ref={uploadInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleUploadInputChange}
                tabIndex={-1}
                aria-hidden="true"
              />
              <ToolbarButton
                label={
                  isUploading
                    ? t('fileTree.uploadingFiles', 'Uploading…')
                    : t('fileTree.uploadFiles', `Upload (max ${MAX_FILE_UPLOAD_SIZE_LABEL})`)
                }
                onClick={() => uploadInputRef.current?.click()}
                disabled={operationLoading}
              >
                {isUploading ? (
                  <div className="relative">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    {typeof uploadProgress === 'number' && (
                      <span
                        className="absolute bottom-0 left-1/2 block h-0.5 -translate-x-1/2 rounded-full bg-[var(--color-teal)] transition-[width] duration-150"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    )}
                  </div>
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
              </ToolbarButton>
            </>
          )}

          {/* New file */}
          {onNewFile && (
            <ToolbarButton
              label={t('fileTree.newFile', 'New File')}
              onClick={onNewFile}
              disabled={operationLoading}
            >
              <FileText className="h-3.5 w-3.5" />
            </ToolbarButton>
          )}

          {/* New folder */}
          {onNewFolder && (
            <ToolbarButton
              label={t('fileTree.newFolder', 'New Folder')}
              onClick={onNewFolder}
              disabled={operationLoading}
            >
              <FolderPlus className="h-3.5 w-3.5" />
            </ToolbarButton>
          )}

          {/* Refresh */}
          {onRefresh && (
            <ToolbarButton
              label={t('fileTree.refresh', 'Refresh')}
              onClick={onRefresh}
              disabled={operationLoading}
            >
              <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
            </ToolbarButton>
          )}

          {/* Collapse all */}
          {onCollapseAll && (
            <ToolbarButton label={t('fileTree.collapseAll', 'Collapse All')} onClick={onCollapseAll}>
              <ChevronDown className="h-3.5 w-3.5" />
            </ToolbarButton>
          )}

          {/* Divider */}
          <div className="mx-1 h-4 w-px bg-border/60" />

          {/* View mode toggles */}
          <ToolbarButton
            label={t('fileTree.simpleView', 'Simple')}
            onClick={() => onViewModeChange('simple')}
            isActive={viewMode === 'simple'}
          >
            <List className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            label={t('fileTree.compactView', 'Compact')}
            onClick={() => onViewModeChange('compact')}
            isActive={viewMode === 'compact'}
          >
            <Eye className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            label={t('fileTree.detailedView', 'Detailed')}
            onClick={() => onViewModeChange('detailed')}
            isActive={viewMode === 'detailed'}
          >
            <TableProperties className="h-3.5 w-3.5" />
          </ToolbarButton>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-text-faint)]" />
        <Input
          type="text"
          placeholder={t('fileTree.searchPlaceholder', 'Search files…')}
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          className="h-8 rounded-lg border border-border/60 bg-slate-50 pl-8 pr-8 text-sm placeholder:text-muted-foreground/60 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 dark:bg-slate-800/60"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0.5 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-slate-200 dark:hover:bg-slate-700"
            onClick={() => onSearchQueryChange('')}
            title={t('fileTree.clearSearch', 'Clear search')}
            aria-label={t('fileTree.clearSearch', 'Clear search')}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
