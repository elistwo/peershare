
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import type { Archive, Post } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

type ArchiveContextType = {
  archives: Archive[];
  activeArchive: Archive | null;
  setActiveArchive: (id: string) => void;
  addPost: (post: Omit<Post, "id" | "createdAt">) => void;
  updatePost: (post: Post) => void;
  deleteArchive: (id: string) => void;
  importArchive: (files: File[]) => Promise<void>;
  importArchiveFromUrl: (url: string) => Promise<void>;
  exportArchive: (id: string) => void;
  createAndActivateArchive: () => string;
  updateArchive: (id: string, updates: Partial<Archive>) => void;
  refreshArchive: (id: string) => Promise<void>;
  forkArchive: (id: string) => void;
};

const ArchiveContext = createContext<ArchiveContextType | undefined>(undefined);

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const defaultDisplayOptions: Required<Archive['displayOptions']> = {
    layout: 'grid',
    cardStyle: 'default',
    imageFit: 'cover',
    borderRadius: 'lg',
    searchBarPosition: 'top',
    showTitle: true,
    headerPosition: 'top',
    headerAlignment: 'center',
    actionButtons: {
        theme: true,
        archives: true,
        settings: true,
        import: true,
        export: true,
        newPost: true
    }
};

export function ArchiveProvider({ children }: { children: ReactNode }) {
  const [archives, setArchives] = useState<Archive[]>([]);
  const [activeArchiveId, setActiveArchiveId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedArchives = localStorage.getItem("peerShareArchives");
      const storedActiveId = localStorage.getItem("peerShareActiveArchiveId");
      if (storedArchives) {
        const parsedArchives: Archive[] = JSON.parse(storedArchives);
        setArchives(parsedArchives);
        if (storedActiveId && parsedArchives.some((a) => a.id === storedActiveId)) {
          setActiveArchiveId(storedActiveId);
        } else if (parsedArchives.length > 0) {
          setActiveArchiveId(parsedArchives[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to load archives from localStorage", error);
      toast({
        title: "Error",
        description: "Could not load data from your local storage.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const saveArchives = useCallback((newArchives: Archive[], newActiveId: string | null) => {
    try {
      // Sort archives: online archives first, then local, then by name
      newArchives.sort((a, b) => {
        if (a.isOnline && !b.isOnline) return -1;
        if (!a.isOnline && b.isOnline) return 1;
        return a.name.localeCompare(b.name);
      });
      
      setArchives(newArchives);
      setActiveArchiveId(newActiveId);
      localStorage.setItem("peerShareArchives", JSON.stringify(newArchives));
      if (newActiveId) {
        localStorage.setItem("peerShareActiveArchiveId", newActiveId);
      } else {
        localStorage.removeItem("peerShareActiveArchiveId");
      }
    } catch (error) {
      console.error("Failed to save archives to localStorage", error);
       toast({
        title: "Error",
        description: "Could not save data to your local storage.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const createAndActivateArchive = () => {
    const newId = `archive-${Date.now()}`;
    const newArchive: Archive = {
      id: newId,
      name: `New Archive ${archives.filter(a => !a.isOnline).length + 1}`,
      description: "A place for your thoughts.",
      posts: [],
      isOnline: false,
      displayOptions: defaultDisplayOptions
    };
    const updatedArchives = [...archives, newArchive];
    saveArchives(updatedArchives, newId);
    toast({
        title: "Archive Created",
        description: `"${newArchive.name}" has been created.`,
    });
    return newId;
  };

  const setActiveArchive = (id: string) => {
    if (archives.some(archive => archive.id === id)) {
      saveArchives(archives, id);
    }
  };

  const handleNewArchiveData = (archiveData: any, sourceUrl?: string) => {
    if (!archiveData.id || !archiveData.name || !Array.isArray(archiveData.posts)) {
      throw new Error(`Invalid archive file format.`);
    }

    const newArchive: Archive = { ...archiveData, sourceUrl: sourceUrl, isOnline: !!sourceUrl };

    const existingArchiveIndex = archives.findIndex(a => a.id === newArchive.id);
    let updatedArchives;
    
    if (existingArchiveIndex > -1) {
      // If it exists, update it, preserving its "forked" status if it was local
      const existingArchive = archives[existingArchiveIndex];
      updatedArchives = [...archives];
      updatedArchives[existingArchiveIndex] = { 
        ...newArchive, 
        isOnline: existingArchive.isOnline, // Preserve online status
        sourceUrl: existingArchive.sourceUrl // Preserve original source url
      };
      if (sourceUrl) { // If we're refreshing from a URL, update these fields
        updatedArchives[existingArchiveIndex].isOnline = true;
        updatedArchives[existingArchiveIndex].sourceUrl = sourceUrl;
      }
    } else {
      updatedArchives = [...archives, newArchive];
    }
    
    saveArchives(updatedArchives, newArchive.id);
    
    return newArchive;
  };

  const importArchive = async (files: File[]) => {
    if (files.length === 0) return;

    for (const file of files) {
        if (file.type === "application/json") {
          try {
            const content = await file.text();
            const archiveData = JSON.parse(content);
            const newArchive = handleNewArchiveData(archiveData);
            toast({
              title: "Import Successful",
              description: `Archive "${newArchive.name}" was imported.`,
            });
          } catch (error: any) {
            console.error("Error importing archive:", error);
            toast({
              title: "Import Failed",
              description: error.message || `Could not parse ${file.name}.`,
              variant: "destructive",
            });
          }
        } else {
             toast({
                title: "Import Failed",
                description: `File ${file.name} is not a valid PeerShare JSON archive file.`,
                variant: "destructive",
            });
        }
    }
  };
  
  const importArchiveFromUrl = async (url: string) => {
    if (!url) return;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch from URL: ${response.statusText}`);
        }
        const archiveData = await response.json();
        const newArchive = handleNewArchiveData(archiveData, url);
        toast({
          title: "Import Successful",
          description: `Online archive "${newArchive.name}" was imported.`,
        });
    } catch (error: any) {
        console.error("Error importing from URL:", error);
        toast({
            title: "Import Failed",
            description: error.message || `Could not import from the provided URL.`,
            variant: "destructive",
        });
    }
  };
  
  const refreshArchive = async (id: string) => {
    const archive = archives.find(a => a.id === id);
    if (!archive || !archive.sourceUrl) {
      toast({ title: "Refresh failed", description: "Archive is not an online archive.", variant: "destructive" });
      return;
    }
    await importArchiveFromUrl(archive.sourceUrl);
    toast({ title: "Archive Refreshed", description: `"${archive.name}" has been updated.` });
  };
  
  const forkArchive = (id: string) => {
      const originalArchive = archives.find(a => a.id === id);
      if (!originalArchive) return;
      
      const newId = `archive-${Date.now()}`;
      const forkedArchive: Archive = {
          ...JSON.parse(JSON.stringify(originalArchive)), // Deep copy
          id: newId,
          name: `${originalArchive.name} (Fork)`,
          isOnline: false,
          sourceUrl: undefined,
      };

      const updatedArchives = [...archives, forkedArchive];
      saveArchives(updatedArchives, newId);
      toast({ title: "Archive Forked", description: `A local copy "${forkedArchive.name}" was created.` });
  };


  const exportArchive = (id: string) => {
    const archive = archives.find(a => a.id === id);
    if (!archive) {
      toast({ title: "Export failed", description: "Archive not found.", variant: "destructive" });
      return;
    }
    
    // Create a copy and remove runtime-only properties if needed
    const exportableArchive = { ...archive };
    // delete exportableArchive.isOnline; // Example if you don't want to export this
    // delete exportableArchive.sourceUrl;

    const archiveBlob = new Blob([JSON.stringify(exportableArchive, null, 2)], { type: 'application/json' });
    const filename = `peepshare_archive_${archive.name.replace(/\s+/g, '_')}.json`;
    
    downloadBlob(archiveBlob, filename);

    toast({ title: "Exporting Archive", description: "Your archive is being downloaded."});
  };

  const addPost = (postData: Omit<Post, "id" | "createdAt">) => {
    if (!activeArchiveId || activeArchive?.isOnline) {
        toast({ title: "Action not allowed", description: "Cannot add posts to an online archive. Fork it first to create an editable local copy.", variant: "destructive" });
        return;
    }

    const newPost: Post = {
      ...postData,
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const updatedArchives = archives.map((archive) =>
      archive.id === activeArchiveId
        ? { ...archive, posts: [newPost, ...archive.posts] }
        : archive
    );
    saveArchives(updatedArchives, activeArchiveId);
    toast({ title: "Post Created", description: `"${newPost.title}" has been added.` });
  };
  
  const updatePost = (updatedPost: Post) => {
    if (!activeArchiveId || activeArchive?.isOnline) {
      toast({ title: "Action not allowed", description: "Cannot edit posts in an online archive.", variant: "destructive" });
      return;
    }
    const updatedArchives = archives.map((archive) =>
      archive.id === activeArchiveId
        ? { ...archive, posts: archive.posts.map(p => p.id === updatedPost.id ? updatedPost : p) }
        : archive
    );
    saveArchives(updatedArchives, activeArchiveId);
    toast({ title: "Post Updated", description: `"${updatedPost.title}" has been saved.` });
  };
  
  const deleteArchive = (id: string) => {
    const archiveToDelete = archives.find(a => a.id === id);
    if (!archiveToDelete) return;

    const newArchives = archives.filter(a => a.id !== id);
    let newActiveId = activeArchiveId;
    if (activeArchiveId === id) {
      newActiveId = newArchives.length > 0 ? newArchives[0].id : null;
    }
    saveArchives(newArchives, newActiveId);
    toast({ title: "Archive Deleted", description: `"${archiveToDelete.name}" has been deleted.` });
  };

  const updateArchive = (id: string, updates: Partial<Archive>) => {
    setArchives(prevArchives => {
      const newArchives = prevArchives.map(archive => {
        if (archive.id === id) {
          if (archive.isOnline) {
            toast({ title: "Action not allowed", description: "Cannot edit an online archive. Fork it first.", variant: "destructive" });
            return archive;
          }
          const updatedArchive = { ...archive, ...updates };
          if (updates.displayOptions) {
            updatedArchive.displayOptions = {
              ...archive.displayOptions,
              ...updates.displayOptions,
            };
          }
          return updatedArchive;
        }
        return archive;
      });
      // Save to localStorage after state update
      localStorage.setItem("peerShareArchives", JSON.stringify(newArchives));
      if (!updates.displayOptions) {
        toast({ title: "Archive Updated" });
      }
      return newArchives;
    });
  };
  
  const activeArchive = archives.find(a => a.id === activeArchiveId) ?? null;

  return (
    <ArchiveContext.Provider value={{ 
        archives, 
        activeArchive, 
        setActiveArchive, 
        addPost, 
        updatePost, 
        deleteArchive, 
        importArchive,
        importArchiveFromUrl,
        exportArchive, 
        createAndActivateArchive, 
        updateArchive,
        refreshArchive,
        forkArchive
    }}>
      {children}
    </ArchiveContext.Provider>
  );
}

export function useArchive() {
  const context = useContext(ArchiveContext);
  if (context === undefined) {
    throw new Error("useArchive must be used within an ArchiveProvider");
  }
  return context;
}
