
"use client";

import type { Post } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PostContent } from "./post-content";
import { Button } from "./ui/button";
import { Edit } from "lucide-react";

interface PostModalViewProps {
  post: Post | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onEdit?: () => void;
}

export function PostModalView({ post, isOpen, onOpenChange, onEdit }: PostModalViewProps) {
  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full p-0 border-0">
        <DialogHeader>
            <DialogTitle className="sr-only">{post.title}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[90vh] overflow-y-auto relative -mt-14">
          {onEdit && (
            <Button variant="outline" size="icon" className="absolute top-4 right-4 z-10 rounded-full" onClick={onEdit}>
                <Edit className="h-4 w-4"/>
                <span className="sr-only">Edit Post</span>
            </Button>
          )}
          <PostContent post={post} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
