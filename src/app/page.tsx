
"use client";

import { useState, useMemo, useRef, ChangeEvent, useEffect } from "react";
import {
  Search,
  Book,
  FilePlus,
  Import,
  Upload,
  Sun,
  Moon,
  Library,
  Settings,
  X,
  Cog,
} from "lucide-react";
import { useArchive } from "@/hooks/use-archive";
import type { Post } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PostView } from "@/components/post-view";
import { WelcomeScreen } from "@/components/welcome-screen";
import { PostEditor } from "@/components/post-editor";
import { PostCard } from "@/components/post-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "next-themes";
import { ArchiveSidebar } from "@/components/archive-sidebar";
import { ArchiveSettings } from "@/components/archive-settings";
import { Badge } from "@/components/ui/badge";
import { PostModalView } from "@/components/post-modal-view";
import { PortalSidebar } from "@/components/portal-sidebar";
import { cn } from "@/lib/utils";
import { TagCloud } from "@/components/tag-cloud";

function ThemeToggle({ side }: { side: 'left' | 'right' | 'top' | 'bottom'}) {
    const { theme, setTheme } = useTheme();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <div className="h-12 w-12" />; // Placeholder for SSR
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button 
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full h-12 w-12 shadow-lg"
                >
                    {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
            </TooltipTrigger>
            <TooltipContent side={side}>
                <p>Toggle Theme</p>
            </TooltipContent>
        </Tooltip>
    );
}

// Reusable SearchBar
const SearchBarComponent = ({ searchQuery, setSearchQuery }: { searchQuery: string, setSearchQuery: (q: string) => void }) => (
    <div className="relative w-full max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
            type="search"
            placeholder="Search posts by title, content, or tag..."
            className="w-full rounded-full bg-card pl-12 h-12 text-base shadow-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        />
    </div>
);


export default function Home() {
  const {
    archives,
    activeArchive,
    createAndActivateArchive,
    importArchive,
    exportArchive,
  } = useArchive();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [viewingPostInModal, setViewingPostInModal] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayOptions = activeArchive?.displayOptions || {};
  const { 
    layout = 'grid', 
    searchBarPosition = 'top-center',
    showTitle = true,
    headerPosition = 'top',
    headerAlignment = 'center',
    actionButtonsPosition = 'bottom-right',
    actionButtonsDisplayMode = 'stacked',
    portalOptions = {},
    tagCloudOptions = {}
  } = displayOptions;
  
  const actionButtons = useMemo(() => ({
    theme: true,
    archives: true,
    settings: true,
    import: true,
    export: true,
    newPost: true,
    ...(activeArchive?.displayOptions?.actionButtons || {})
  }), [activeArchive?.displayOptions?.actionButtons]);


  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      await importArchive(Array.from(event.target.files));
      event.target.value = ""; // Reset file input
    }
  };

  const openNewPostEditor = () => {
    if (!activeArchive && archives.length === 0) {
      createAndActivateArchive();
    }
    setEditingPost(null);
    setEditorOpen(true);
  };
  
  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setEditorOpen(true);
    setSelectedPostId(null);
    setViewingPostInModal(null);
  }

  const handleExport = () => {
    if (activeArchive) {
      exportArchive(activeArchive.id);
    }
  };

  const allTags = useMemo(() => {
    if (!activeArchive) return [];
    const tags = new Set<string>();
    activeArchive.posts.forEach(post => {
        post.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [activeArchive]);

  const filteredPosts = useMemo(() => {
    if (!activeArchive) return [];
    let posts = activeArchive.posts;

    if (selectedTag) {
        posts = posts.filter(post => post.tags?.includes(selectedTag));
    }

    if (!searchQuery) return posts;

    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [activeArchive, searchQuery, selectedTag]);

  const featuredPosts = useMemo(() => {
    if (!activeArchive || !portalOptions.featuredPostIds) return [];
    const featuredMap = new Map(portalOptions.featuredPostIds.map((id, index) => [id, index]));
    return activeArchive.posts
      .filter(post => featuredMap.has(post.id))
      .sort((a, b) => (featuredMap.get(a.id) ?? Infinity) - (featuredMap.get(b.id) ?? Infinity));
  }, [activeArchive, portalOptions.featuredPostIds]);


  const selectedPost = useMemo(() => {
    if (selectedPostId) {
      return activeArchive?.posts.find((p) => p.id === selectedPostId) ?? null;
    }
    return null;
  }, [activeArchive, selectedPostId]);
  
  useEffect(() => {
    setSelectedPostId(null);
  }, [activeArchive?.id])

  if (!archives.length) {
    return (
      <WelcomeScreen
        onImportClick={handleImportClick}
        onNewPostClick={openNewPostEditor}
      />
    );
  }

  if (selectedPost) {
    return <PostView post={selectedPost} onBack={() => setSelectedPostId(null)} onEdit={!activeArchive?.isOnline ? () => handleEditPost(selectedPost) : undefined} />;
  }

  // --- Reusable Components ---

  const HeaderComponent = () => (
    showTitle && activeArchive ? (
      <div className={cn(
        "space-y-4 py-8 md:py-12",
        headerPosition === 'hero' && "bg-card rounded-3xl mb-8",
      )}>
        <div className={cn("flex flex-col gap-2 container mx-auto px-4 sm:px-6 lg:px-8",
            headerAlignment === 'left' && 'items-start text-left',
            headerAlignment === 'center' && 'items-center text-center',
            headerAlignment === 'right' && 'items-end text-right'
        )}>
          <h1 className="text-4xl font-bold text-foreground">
            {activeArchive.name}
          </h1>
          <p className="text-muted-foreground max-w-2xl">{activeArchive.description}</p>
        </div>

        {(searchBarPosition === 'header' || searchBarPosition === 'header-left' || searchBarPosition === 'header-right') && (
          <div className={cn("flex pt-4 container mx-auto px-4 sm:px-6 lg:px-8",
            searchBarPosition === 'header' && 'justify-center',
            searchBarPosition === 'header-left' && 'justify-start',
            searchBarPosition === 'header-right' && 'justify-end'
          )}>
            <SearchBarComponent searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
        )}
      </div>
    ) : null
  );
  
  const MainContent = () => (
    <>
      {(searchBarPosition === 'top-center' || searchBarPosition === 'top-left' || searchBarPosition === 'top-right') && (
        <div className={cn("mb-6 flex",
            searchBarPosition === 'top-center' && 'justify-center',
            searchBarPosition === 'top-left' && 'justify-start',
            searchBarPosition === 'top-right' && 'justify-end'
        )}>
            <SearchBarComponent searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
      )}
      
      {tagCloudOptions.show !== false && tagCloudOptions.position === 'top-of-content' && (
        <div className="mb-8">
            <TagCloud
                title={tagCloudOptions.title}
                tags={allTags}
                selectedTag={selectedTag}
                onTagSelect={setSelectedTag}
            />
        </div>
      )}
        
      {filteredPosts.length > 0 ? (
        <div className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2",
          layout.startsWith('portal') ? "lg:grid-cols-2 xl:grid-cols-3" : "md:grid-cols-3 xl:grid-cols-4"
        )}>
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onSelect={() => setSelectedPostId(post.id)}
              onExpand={() => setViewingPostInModal(post)}
              displayOptions={activeArchive?.displayOptions}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-[calc(100vh-20rem)] flex-col items-center justify-center text-center">
          <div className="mx-auto max-w-md">
            {searchQuery || selectedTag ? (
              <>
                <Search className="mx-auto mb-4 size-16 text-muted-foreground" />
                <h2 className="text-2xl font-semibold">
                  No Results Found
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Your search or filter did not return any results.
                </p>
              </>
            ) : (
              <>
                <Book className="mx-auto mb-4 size-16 text-muted-foreground" />
                <h2 className="text-2xl font-semibold">
                  This archive is empty
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Click the 'New Post' button to create your first post.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {tagCloudOptions.show !== false && tagCloudOptions.position === 'bottom-of-content' && (
        <div className="mt-12">
            <TagCloud
                title={tagCloudOptions.title}
                tags={allTags}
                selectedTag={selectedTag}
                onTagSelect={setSelectedTag}
            />
        </div>
      )}
    </>
  );

  const ActionButtons = () => {
    const [fabOpen, setFabOpen] = useState(false);
    
    const isCentered = actionButtonsPosition.includes('center');
    const tooltipSide = actionButtonsPosition.includes('left') ? 'right' :
                        actionButtonsPosition.includes('right') ? 'left' :
                        'top';
    
    const fabDirectionClass = isCentered ? 'flex-row' :
                              actionButtonsPosition.includes('top') ? 'flex-col-reverse' : 
                              'flex-col';

    const buttonListElements = [
        actionButtons.theme && <ThemeToggle key="theme" side={tooltipSide}/>,
        actionButtons.archives && archives.length > 0 && (
            <Tooltip key="archives">
            <TooltipTrigger asChild>
                <Button onClick={() => { setSidebarOpen(true); setFabOpen(false); }} variant="outline" size="icon" className="rounded-full h-12 w-12 shadow-lg">
                    <Library className="h-5 w-5" />
                </Button>
            </TooltipTrigger>
            <TooltipContent side={tooltipSide}><p>Manage Archives</p></TooltipContent>
            </Tooltip>
        ),
        actionButtons.settings && activeArchive && !activeArchive.isOnline && (
            <Tooltip key="settings">
            <TooltipTrigger asChild>
                <Button onClick={() => { setSettingsOpen(true); setFabOpen(false); }} variant="outline" size="icon" className="rounded-full h-12 w-12 shadow-lg">
                    <Settings className="h-5 w-5" />
                </Button>
            </TooltipTrigger>
            <TooltipContent side={tooltipSide}><p>Archive Settings</p></TooltipContent>
            </Tooltip>
        ),
        actionButtons.import && (
            <Tooltip key="import">
                <TooltipTrigger asChild>
                    <Button onClick={() => { handleImportClick(); setFabOpen(false); }} variant="outline" size="icon" className="rounded-full h-12 w-12 shadow-lg">
                        <Import className="h-5 w-5" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side={tooltipSide}><p>Import Archive</p></TooltipContent>
            </Tooltip>
        ),
        actionButtons.export && (
            <Tooltip key="export">
                <TooltipTrigger asChild>
                    <Button onClick={() => { handleExport(); setFabOpen(false); }} variant="outline" size="icon" className="rounded-full h-12 w-12 shadow-lg" disabled={!activeArchive}>
                        <Upload className="h-5 w-5" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side={tooltipSide}><p>Export Active Archive</p></TooltipContent>
            </Tooltip>
        ),
        actionButtons.newPost && (
            <Tooltip key="newPost">
                <TooltipTrigger asChild>
                    <Button onClick={() => { openNewPostEditor(); setFabOpen(false); }} size="icon" className="rounded-full h-16 w-16 shadow-lg" disabled={activeArchive?.isOnline}>
                        <FilePlus className="h-7 w-7" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side={tooltipSide}><p>New Post</p></TooltipContent>
            </Tooltip>
        )
    ].filter(Boolean);

    const FabMenu = () => {
      if (isCentered) {
        const midPoint = Math.ceil(buttonListElements.length / 2);
        const leftButtons = buttonListElements.slice(0, midPoint);
        const rightButtons = buttonListElements.slice(midPoint);

        return (
          <div className="relative flex justify-center items-center">
            {/* The expanding buttons */}
            <div
              className={cn(
                'flex items-center gap-4 transition-all duration-300 ease-in-out',
                fabOpen
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-95 pointer-events-none'
              )}
            >
              {/* Left side */}
              <div className="flex items-center gap-2">{leftButtons}</div>

              {/* Spacer element that will be hidden, but keeps the main button centered */}
              <div className="h-16 w-16" />

              {/* Right side */}
              <div className="flex items-center gap-2">{rightButtons}</div>
            </div>

            {/* The main FAB button, positioned absolutely to stay in the center */}
            <div className="absolute">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setFabOpen(!fabOpen)}
                    size="icon"
                    className="rounded-full h-16 w-16 shadow-lg z-10"
                  >
                    <Cog
                      className={cn(
                        'h-7 w-7 transition-transform duration-300',
                        fabOpen && 'rotate-90'
                      )}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side={tooltipSide}>
                  <p>Actions</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        );
      }

      // Default FAB behavior for corner positions
      return (
        <div className={cn("relative flex items-center", fabDirectionClass)}>
          <div
            className={cn(
              "flex gap-2 transition-all duration-300 ease-in-out",
              fabDirectionClass,
              fabOpen
                ? "opacity-100"
                : "opacity-0 pointer-events-none -translate-y-2"
            )}
          >
            {buttonListElements}
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setFabOpen(!fabOpen)}
                size="icon"
                className={cn("rounded-full h-16 w-16 shadow-lg", fabDirectionClass === 'flex-col' ? 'mt-2' : 'ml-2')}
              >
                <Cog className={cn("h-7 w-7 transition-transform duration-300", fabOpen && "rotate-90")} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side={tooltipSide}><p>Actions</p></TooltipContent>
          </Tooltip>
        </div>
      );
    };

    return (
     <div className={cn("fixed z-50",
        actionButtonsPosition === 'top-left' && 'top-6 left-6',
        actionButtonsPosition === 'top-right' && 'top-6 right-6',
        actionButtonsPosition === 'bottom-left' && 'bottom-6 left-6',
        actionButtonsPosition === 'bottom-right' && 'bottom-6 right-6',
        actionButtonsPosition === 'top-center' && 'top-6 left-1/2 -translate-x-1/2',
        actionButtonsPosition === 'bottom-center' && 'bottom-6 left-1/2 -translate-x-1/2'
      )}>
        <TooltipProvider>
            {actionButtonsDisplayMode === 'fab' ? (
                <FabMenu />
            ) : (
                <div className={cn("relative flex gap-2 items-center", fabDirectionClass)}>
                    {searchBarPosition === 'floating-bottom-right' && actionButtonsPosition === 'bottom-right' && (
                        <div className="w-full max-w-sm mb-2">
                            <SearchBarComponent searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                        </div>
                    )}
                    {buttonListElements}
                </div>
            )}
        </TooltipProvider>
      </div>
    );
  }


  // --- Main Render ---

  return (
    <div className="flex flex-col min-h-screen">
      <ArchiveSidebar open={isSidebarOpen} onOpenChange={setSidebarOpen} />
      <ArchiveSettings open={isSettingsOpen} onOpenChange={setSettingsOpen} />
      
      {headerPosition === 'top' && <HeaderComponent />}
      
      <main className="flex-1 w-full container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {layout.startsWith('portal') ? (
            <div className={cn("grid grid-cols-1 gap-8", 
                layout === 'portal-left' && 'lg:grid-cols-[1fr_3fr]',
                layout === 'portal-right' && 'lg:grid-cols-[3fr_1fr]'
            )}>
                {layout === 'portal-left' ? (
                    <>
                        <aside>
                            {activeArchive && activeArchive.posts.length > 0 && (
                                <PortalSidebar 
                                    posts={featuredPosts}
                                    portalOptions={portalOptions}
                                    onPostSelect={(id) => setSelectedPostId(id)}
                                    tags={allTags}
                                    selectedTag={selectedTag}
                                    onTagSelect={setSelectedTag}
                                    tagCloudOptions={tagCloudOptions}
                                />
                            )}
                        </aside>
                        <div>
                            <MainContent/>
                        </div>
                    </>
                ) : (
                     <>
                        <div>
                            <MainContent/>
                        </div>
                        <aside>
                            {activeArchive && activeArchive.posts.length > 0 && (
                                <PortalSidebar 
                                    posts={featuredPosts}
                                    portalOptions={portalOptions}
                                    onPostSelect={(id) => setSelectedPostId(id)}
                                    tags={allTags}
                                    selectedTag={selectedTag}
                                    onTagSelect={setSelectedTag}
                                    tagCloudOptions={tagCloudOptions}
                                />
                            )}
                        </aside>
                    </>
                )}
            </div>
        ) : (
            <MainContent />
        )}

      </main>

      {(headerPosition === 'hero' || headerPosition === 'bottom') && <HeaderComponent />}

       {searchBarPosition === 'floating-top-left' && (
        <div className="fixed top-6 left-6 z-50 w-full max-w-sm">
            <SearchBarComponent searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
      )}
       {searchBarPosition === 'floating-top-right' && (
        <div className="fixed top-6 right-6 z-50 w-full max-w-sm">
            <SearchBarComponent searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
      )}
       {searchBarPosition === 'floating-bottom-left' && (
        <div className="fixed bottom-6 left-6 z-50 w-full max-w-sm">
            <SearchBarComponent searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
      )}
      {searchBarPosition === 'floating-bottom-right' && actionButtonsPosition !== 'bottom-right' && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm">
            <SearchBarComponent searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
      )}
      
      <ActionButtons />
      
      <PostEditor
        isOpen={isEditorOpen}
        setOpen={setEditorOpen}
        post={editingPost}
      />
      <PostModalView 
        post={viewingPostInModal}
        isOpen={!!viewingPostInModal}
        onOpenChange={(isOpen) => !isOpen && setViewingPostInModal(null)}
        onEdit={!activeArchive?.isOnline && viewingPostInModal ? () => handleEditPost(viewingPostInModal) : undefined}
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".json"
        multiple
      />
    </div>
  );
}
