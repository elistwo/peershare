
"use client";

import { useState } from 'react';
import { useArchive } from '@/hooks/use-archive';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from './ui/button';
import { FilePlus, MoreVertical, Trash2, Globe, RefreshCw, GitFork, Link } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

interface ArchiveSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArchiveSidebar({ open, onOpenChange }: ArchiveSidebarProps) {
  const {
    archives,
    activeArchive,
    setActiveArchive,
    createAndActivateArchive,
    deleteArchive,
    importArchiveFromUrl,
    refreshArchive,
    forkArchive,
  } = useArchive();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [url, setUrl] = useState('');

  const handleCreateNew = () => {
    createAndActivateArchive();
    onOpenChange(false);
  };
  
  const handleImportUrl = async () => {
    await importArchiveFromUrl(url);
    setUrl('');
  };

  const handleSelectArchive = (id: string) => {
    setActiveArchive(id);
    onOpenChange(false);
  }

  const handleDeleteConfirm = () => {
    if (deletingId) {
      deleteArchive(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Your Archives</SheetTitle>
            <SheetDescription>
              Switch between, create, or manage your local and online archives.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4 flex flex-col h-full">
            <div className="flex flex-col gap-4 mb-4">
                <Button onClick={handleCreateNew}>
                  <FilePlus className="mr-2 h-4 w-4" />
                  Create New Local Archive
                </Button>
                <div className='space-y-2'>
                    <div className="relative">
                        <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Import from URL..."
                            className="pl-9"
                        />
                    </div>
                    <Button onClick={handleImportUrl} variant="secondary" className="w-full" disabled={!url}>Import Online Archive</Button>
                </div>
            </div>
            
            <p className="text-sm font-medium text-muted-foreground mb-2 px-1">
              Available Archives ({archives.length})
            </p>
            <ScrollArea className="flex-1 -mx-6">
                <div className="px-6">
                    {archives.length > 0 ? (
                        <ul className="space-y-2">
                        {archives.map((archive) => (
                            <li
                            key={archive.id}
                            className={cn(
                                "flex items-center justify-between rounded-lg transition-colors group/item",
                                activeArchive?.id === archive.id
                                ? 'bg-primary/10'
                                : 'hover:bg-accent'
                            )}
                            >
                                <button 
                                    className="flex-1 text-left truncate p-3"
                                    onClick={() => handleSelectArchive(archive.id)}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className={cn("font-semibold", activeArchive?.id === archive.id && 'text-primary')}>{archive.name}</span>
                                        {archive.isOnline && <Badge variant="outline"><Globe className="h-3 w-3 mr-1"/>Online</Badge>}
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate pointer-events-none">{archive.posts.length} {archive.posts.length === 1 ? 'post' : 'posts'}</p>
                                </button>
                            
                            <div className="pr-1">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {archive.isOnline && (
                                          <>
                                            <DropdownMenuItem onSelect={() => refreshArchive(archive.id)}>
                                                <RefreshCw className="mr-2 h-4 w-4" />
                                                <span>Refresh</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => forkArchive(archive.id)}>
                                                <GitFork className="mr-2 h-4 w-4" />
                                                <span>Fork as Local Copy</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                          </>
                                        )}
                                        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setDeletingId(archive.id)}}>
                                            <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                            <span className="text-destructive">Delete</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            </li>
                        ))}
                        </ul>
                    ) : (
                        <div className="text-center text-muted-foreground py-10">
                            No archives yet.
                        </div>
                    )}
                </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deletingId} onOpenChange={(isOpen) => !isOpen && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the archive and all its posts from your browser.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

    