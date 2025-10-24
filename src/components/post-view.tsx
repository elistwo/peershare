
"use client";

import { ArrowLeft, Edit } from "lucide-react";
import type { Post } from "@/lib/types";
import { Button } from "./ui/button";
import { PostContent } from "./post-content";

interface PostViewProps {
  post: Post;
  onEdit?: () => void;
  onBack: () => void;
}

export function PostView({ post, onEdit, onBack }: PostViewProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
          <div className="relative max-w-4xl mx-auto">
            <Button variant="ghost" onClick={onBack} className="mb-6 rounded-full pl-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
            {onEdit && (
                <Button variant="outline" size="icon" className="absolute top-0 right-0 mt-4 mr-4 rounded-full" onClick={onEdit}>
                    <Edit className="h-4 w-4"/>
                    <span className="sr-only">Edit Post</span>
                </Button>
            )}
          </div>
          <PostContent post={post} />
      </div>
    </div>
  );
}

