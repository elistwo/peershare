
"use client";

import { useState, useEffect } from "react";
import type { Post, PortalOptions, TagCloudOptions } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { format } from "date-fns";
import { TagCloud } from "./tag-cloud";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";

interface PortalSidebarProps {
  posts: Post[];
  onPostSelect: (id: string) => void;
  portalOptions: PortalOptions;
  tags: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
  tagCloudOptions: TagCloudOptions;
}

const ClientFormattedDate = ({
  dateString,
  formatString,
}: {
  dateString: string;
  formatString: string;
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  try {
    return <>{format(new Date(dateString), formatString)}</>;
  } catch (e) {
    return null;
  }
};


export function PortalSidebar({ posts, onPostSelect, portalOptions = {}, tags, selectedTag, onTagSelect, tagCloudOptions }: PortalSidebarProps) {
  const { title = "Featured Posts", limit, sidebarOrder = 'posts-tags' } = portalOptions;
  
  const limitedPosts = limit ? posts.slice(0, limit) : posts;
  
  const showTagCloud = tagCloudOptions.show !== false && tagCloudOptions.position === 'portal-sidebar' && tags.length > 0;
  const showFeaturedPosts = limitedPosts.length > 0;

  if (!showTagCloud && !showFeaturedPosts) {
     return (
        <Card className="bg-card/50">
            <CardHeader>
                <CardTitle>Portal Sidebar</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">This sidebar is empty. Configure featured posts or the tag cloud in the archive settings.</p>
            </CardContent>
        </Card>
    );
  }

  const PostsComponent = () => showFeaturedPosts ? (
    <Card className="bg-card/50">
        <CardHeader>
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
            {limitedPosts.map((post) => (
                <div
                key={post.id}
                className="flex items-start gap-4 group cursor-pointer"
                onClick={() => onPostSelect(post.id)}
                >
                <div className="relative aspect-[16/9] w-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    {post.previewImageUrl && (
                    <Image src={post.previewImageUrl} alt={post.title} fill style={{ objectFit: 'cover' }} />
                    )}
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
                    <p className="text-xs text-muted-foreground">
                        <ClientFormattedDate dateString={post.createdAt} formatString="MMM d, yyyy" />
                    </p>
                </div>
                </div>
            ))}
            </div>
        </CardContent>
    </Card>
  ) : null;

  const TagCloudComponent = () => showTagCloud ? (
     <TagCloud
        title={tagCloudOptions.title}
        tags={tags}
        selectedTag={selectedTag}
        onTagSelect={onTagSelect}
        isCard
    />
  ) : null;
  
  const showSeparator = showTagCloud && showFeaturedPosts;

  return (
    <div className="space-y-6">
       {sidebarOrder === 'tags-posts' ? (
        <>
            <TagCloudComponent />
            {showSeparator && <Separator />}
            <PostsComponent />
        </>
       ) : (
        <>
            <PostsComponent />
            {showSeparator && <Separator />}
            <TagCloudComponent />
        </>
       )}
    </div>
  );
}
