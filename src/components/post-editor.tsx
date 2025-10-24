
"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useArchive } from "@/hooks/use-archive";
import type { Post } from "@/lib/types";
import { useEffect, useMemo } from "react";
import Image from "next/image";
import { TagInput } from "./tag-input";
import { cn } from "@/lib/utils";

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  content: z.string().min(1, "Content cannot be empty"),
  tags: z.array(z.string()).optional(),
  previewImageUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

type PostFormData = z.infer<typeof postSchema>;

interface PostEditorProps {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  post?: Post | null;
}

export function PostEditor({ isOpen, setOpen, post }: PostEditorProps) {
  const { addPost, updatePost, activeArchive } = useArchive();

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
        title: '',
        author: 'Anonymous',
        content: '',
        tags: [],
        previewImageUrl: '',
    }
  });

  const previewImageUrl = watch("previewImageUrl");

  const availableTags = useMemo(() => {
    if (!activeArchive) return [];
    const tags = new Set<string>();
    activeArchive.posts.forEach(p => {
        p.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [activeArchive]);

  useEffect(() => {
    if (isOpen) {
      if (post) {
        reset({
          ...post,
          tags: post.tags || [],
          previewImageUrl: post.previewImageUrl || '',
        });
      } else {
        reset({
          title: "",
          author: "Anonymous",
          content: "",
          tags: [],
          previewImageUrl: "",
        });
      }
    }
  }, [post, isOpen, reset]);

  const onSubmit = (data: PostFormData) => {
    const postData = {
      title: data.title,
      author: data.author,
      content: data.content,
      tags: data.tags || [],
      previewImageUrl: data.previewImageUrl || undefined,
    }

    if (post) {
      updatePost({ ...post, ...postData });
    } else {
      addPost(postData);
    }
    setOpen(false);
  };

  const isPreviewable = useMemo(() => {
    if (!previewImageUrl) return false;
    try {
      new URL(previewImageUrl);
      return !errors.previewImageUrl;
    } catch {
      return false;
    }
  }, [previewImageUrl, errors.previewImageUrl]);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{post ? "Edit Post" : "Create New Post"}</DialogTitle>
          <DialogDescription>
            {activeArchive
              ? (activeArchive.isOnline ? "You cannot modify an online archive. Fork it first." : `This post will be ${post ? 'updated in' : 'added to'} "${activeArchive.name}".`)
              : "Create an archive first to save this post."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <div className="col-span-3">
              <Input id="title" {...register("title")} />
              {errors.title && (
                <p className="text-sm text-destructive mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="author" className="text-right">
              Author
            </Label>
            <div className="col-span-3">
                <Input id="author" {...register("author")} />
                {errors.author && (
                    <p className="text-sm text-destructive mt-1">
                    {errors.author.message}
                    </p>
                )}
            </div>
          </div>
           <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="tags" className="text-right pt-2">
              Tags
            </Label>
            <div className="col-span-3">
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <TagInput
                    {...field}
                    tags={field.value || []}
                    setTags={(newTags) => field.onChange(newTags)}
                    suggestions={availableTags}
                  />
                )}
              />
               {errors.tags && (
                <p className="text-sm text-destructive mt-1">
                  {errors.tags.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="previewImageUrl" className="text-right pt-2">
              Preview Image
            </Label>
            <div className="col-span-3">
              <Input id="previewImageUrl" {...register("previewImageUrl")} placeholder="https://example.com/image.png" className={cn({ 'border-destructive': errors.previewImageUrl })}/>
              {errors.previewImageUrl && (
                <p className="text-sm text-destructive mt-1">
                  {errors.previewImageUrl?.message}
                </p>
              )}
              {isPreviewable && (
                <div className="mt-4 aspect-video w-full relative rounded-md overflow-hidden border">
                    <Image src={previewImageUrl} alt="Preview" fill style={{ objectFit: 'cover' }} />
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="content" className="text-right pt-2">
              Content
            </Label>
            <div className="col-span-3">
              <Textarea
                id="content"
                {...register("content")}
                className="min-h-[300px] font-code"
                placeholder="Write your post using Markdown..."
              />
              {errors.content && (
                <p className="text-sm text-destructive mt-1">
                  {errors.content.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={activeArchive?.isOnline}>Save Post</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
