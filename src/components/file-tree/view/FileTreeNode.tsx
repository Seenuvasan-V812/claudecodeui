import type { ReactNode, RefObject } from 'react';
import { ChevronRight, Folder, FolderOpen } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { FileTreeNode as FileTreeNodeType, FileTreeViewMode } from '../types/types';
import { Input } from '../../../shared/view/ui';
import FileContextMenu from './FileContextMenu';

type FileTreeNodeProps = {
  item: FileTreeNodeType;
  level: number;
  viewMode: FileTreeViewMode;
  expandedDirs: Set<string>;
  onItemClick: (item: FileTreeNodeType) => void;
  renderFileIcon: (filename: string) => ReactNode;
  formatFileSize: (bytes?: number) => string;
  formatRelativeTime: (date?: string) => string;
  onRename?: (item: FileTreeNodeType) => void;
  onDelete?: (item: FileTreeNodeType) => void;
  onNewFile?: (path: string) => void;
  onNewFolder?: (path: string) => void;
  onCopyPath?: (item: FileTreeNodeType) => void;
  onDownload?: (item: FileTreeNodeType) => void;
  onRefresh?: () => void;
  // Rename state for inline editing
  renamingItem?: FileTreeNodeType | null;
  renameValue?: string;
  setRenameValue?: (value: string) => void;
  handleConfirmRename?: () => void;
  handleCancelRename?: () => void;
  renameInputRef?: RefObject<HTMLInputElement>;
  operationLoading?: boolean;
  // Selected file path for highlight
  selectedFilePath?: string;
};

type TreeItemIconProps = {
  item: FileTreeNodeType;
  isOpen: boolean;
  renderFileIcon: (filename: string) => ReactNode;
};

function TreeItemIcon({ item, isOpen, renderFileIcon }: TreeItemIconProps) {
  if (item.type === 'directory') {
    return (
      <span className="flex flex-shrink-0 items-center gap-0.5">
        <ChevronRight
          className={cn(
            'h-3.5 w-3.5 text-muted-foreground/60 transition-transform duration-200',
            isOpen && 'rotate-90',
          )}
        />
        {isOpen ? (
          // Open folder — amber/gold
          <FolderOpen className="h-4 w-4 flex-shrink-0 text-amber-500 dark:text-amber-400" />
        ) : (
          // Closed folder — amber/gold, slightly darker
          <Folder className="h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-500" />
        )}
      </span>
    );
  }

  return <span className="ml-[18px] flex flex-shrink-0 items-center">{renderFileIcon(item.name)}</span>;
}

export default function FileTreeNode({
  item,
  level,
  viewMode,
  expandedDirs,
  onItemClick,
  renderFileIcon,
  formatFileSize,
  formatRelativeTime,
  onRename,
  onDelete,
  onNewFile,
  onNewFolder,
  onCopyPath,
  onDownload,
  onRefresh,
  renamingItem,
  renameValue,
  setRenameValue,
  handleConfirmRename,
  handleCancelRename,
  renameInputRef,
  operationLoading,
  selectedFilePath,
}: FileTreeNodeProps) {
  const isDirectory = item.type === 'directory';
  const isOpen = isDirectory && expandedDirs.has(item.path);
  const hasChildren = Boolean(isDirectory && item.children && item.children.length > 0);
  const isRenaming = renamingItem?.path === item.path;
  const isSelected = !isDirectory && selectedFilePath === item.path;

  const nameClassName = cn(
    'text-[13px] leading-tight truncate transition-colors duration-180',
    isSelected
      ? 'text-white font-medium'
      : isDirectory
        ? 'font-medium text-foreground'
        : 'text-foreground/90',
  );

  // Base row classes — selected: teal bg + white text; hover: light gray (light) / dark gray (dark)
  const rowClassName = cn(
    'group select-none text-foreground transition-colors duration-[180ms]',
    isSelected
      ? 'bg-teal-600 dark:bg-teal-500 text-white rounded-md'
      : 'hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md',
    viewMode === 'detailed'
      ? 'grid grid-cols-12 gap-2 py-[3px] pr-2 items-center cursor-pointer'
      : viewMode === 'compact'
        ? 'flex items-center justify-between py-[3px] pr-2 cursor-pointer'
        : 'flex items-center gap-1.5 py-[3px] pr-2 cursor-pointer',
  );

  // Render rename input if this item is being renamed
  if (isRenaming && setRenameValue && handleConfirmRename && handleCancelRename) {
    return (
      <div
        className={cn(rowClassName, 'bg-[var(--color-surface-2)]')}
        style={{ paddingLeft: `${level * 16 + 4}px` }}
        onClick={(e) => e.stopPropagation()}
      >
        <TreeItemIcon item={item} isOpen={isOpen} renderFileIcon={renderFileIcon} />
        <Input
          ref={renameInputRef}
          type="text"
          value={renameValue || ''}
          onChange={(e) => setRenameValue(e.target.value)}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === 'Enter') handleConfirmRename();
            if (e.key === 'Escape') handleCancelRename();
          }}
          onBlur={() => {
            setTimeout(() => {
              handleConfirmRename();
            }, 100);
          }}
          className="h-6 flex-1 text-sm"
          disabled={operationLoading}
        />
      </div>
    );
  }

  const rowContent = (
    <div
      className={rowClassName}
      style={{ paddingLeft: `${level * 16 + 4}px` }}
      onClick={() => onItemClick(item)}
    >
      {viewMode === 'detailed' ? (
        <>
          <div className="col-span-5 flex min-w-0 items-center gap-1.5">
            <TreeItemIcon item={item} isOpen={isOpen} renderFileIcon={renderFileIcon} />
            <span className={nameClassName}>{item.name}</span>
          </div>
          <div className="col-span-2 text-sm tabular-nums text-muted-foreground">
            {item.type === 'file' ? formatFileSize(item.size) : ''}
          </div>
          <div className="col-span-3 text-sm text-muted-foreground">{formatRelativeTime(item.modified)}</div>
          <div className="col-span-2 font-mono text-sm text-muted-foreground">{item.permissionsRwx || ''}</div>
        </>
      ) : viewMode === 'compact' ? (
        <>
          <div className="flex min-w-0 items-center gap-1.5">
            <TreeItemIcon item={item} isOpen={isOpen} renderFileIcon={renderFileIcon} />
            <span className={nameClassName}>{item.name}</span>
          </div>
          <div className="ml-2 flex flex-shrink-0 items-center gap-3 text-sm text-muted-foreground">
            {item.type === 'file' && (
              <>
                <span className="tabular-nums">{formatFileSize(item.size)}</span>
                <span className="font-mono">{item.permissionsRwx}</span>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <TreeItemIcon item={item} isOpen={isOpen} renderFileIcon={renderFileIcon} />
          <span className={nameClassName}>{item.name}</span>
        </>
      )}
    </div>
  );

  const hasContextMenu = onRename || onDelete || onNewFile || onNewFolder || onCopyPath || onDownload || onRefresh;

  return (
    <div className="select-none">
      {hasContextMenu ? (
        <FileContextMenu
          item={item}
          onRename={onRename}
          onDelete={onDelete}
          onNewFile={onNewFile}
          onNewFolder={onNewFolder}
          onCopyPath={onCopyPath}
          onDownload={onDownload}
          onRefresh={onRefresh}
        >
          {rowContent}
        </FileContextMenu>
      ) : (
        rowContent
      )}

      {/* Children with smooth height animation and dashed indent guide */}
      {isDirectory && hasChildren && (
        <div
          className="relative overflow-hidden transition-all duration-200 ease-in-out"
          style={{
            maxHeight: isOpen ? '9999px' : '0px',
            opacity: isOpen ? 1 : 0,
          }}
        >
          {/* Dashed 1px indent guide */}
          <span
            className="pointer-events-none absolute bottom-0 top-0"
            style={{
              left: `${level * 16 + 14}px`,
              borderLeft: '1px dashed hsl(var(--border))',
              opacity: 0.6,
            }}
            aria-hidden="true"
          />
          {item.children?.map((child) => (
            <FileTreeNode
              key={child.path}
              item={child}
              level={level + 1}
              viewMode={viewMode}
              expandedDirs={expandedDirs}
              onItemClick={onItemClick}
              renderFileIcon={renderFileIcon}
              formatFileSize={formatFileSize}
              formatRelativeTime={formatRelativeTime}
              onRename={onRename}
              onDelete={onDelete}
              onNewFile={onNewFile}
              onNewFolder={onNewFolder}
              onCopyPath={onCopyPath}
              onDownload={onDownload}
              onRefresh={onRefresh}
              renamingItem={renamingItem}
              renameValue={renameValue}
              setRenameValue={setRenameValue}
              handleConfirmRename={handleConfirmRename}
              handleCancelRename={handleCancelRename}
              renameInputRef={renameInputRef}
              operationLoading={operationLoading}
              selectedFilePath={selectedFilePath}
            />
          ))}
        </div>
      )}
    </div>
  );
}
