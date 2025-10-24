"use client";

import { Button } from "@/components/ui/button";
import { Import, FilePlus, MessageSquareText } from "lucide-react";

interface WelcomeScreenProps {
  onImportClick: () => void;
  onNewPostClick: () => void;
}

export function WelcomeScreen({ onImportClick, onNewPostClick }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
      <div className="max-w-lg w-full">
        <div className="flex flex-col items-center text-center p-8 bg-card rounded-2xl shadow-lg">
          <div className="p-4 bg-primary/10 rounded-full mb-6">
            <div className="p-3 bg-primary/20 rounded-full">
              <MessageSquareText className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold font-headline text-foreground">Welcome to PeerShare</h1>
          <p className="text-lg text-muted-foreground mt-3 mb-8 max-w-md">
            Your decentralized space to create, share, and own your content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button size="lg" onClick={onImportClick} variant="outline" className="w-full rounded-full">
              <Import className="mr-2 h-5 w-5" />
              Import Archive
            </Button>
            <Button size="lg" onClick={onNewPostClick} className="w-full rounded-full">
              <FilePlus className="mr-2 h-5 w-5" />
              Create First Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
