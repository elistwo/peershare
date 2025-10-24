
"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar, User } from "lucide-react";
import type { Post } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ClientMarkdownRenderer } from "./client-markdown-renderer";
import { Badge } from "./ui/badge";

interface PostContentProps {
  post: Post;
}

const ClientFormattedDate = ({ dateString, formatString }: { dateString: string, formatString: string }) => {
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
}

export function PostContent({ post }: PostContentProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto rounded-3xl shadow-xl border-2 border-transparent hover:border-primary/10 transition-colors">
      <CardHeader className="relative p-8 md:p-12">
          <CardTitle className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight">{post.title}</CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-2 text-base text-muted-foreground pt-4">
            <span className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {post.author}
            </span>
            <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <ClientFormattedDate dateString={post.createdAt} formatString="MMMM d, yyyy 'at' HH:mm" />
            </span>
          </CardDescription>
      </CardHeader>
      <CardContent className="p-8 pt-0 flex flex-col">
          {post.tags && post.tags.length > 0 && (
              <div className="w-full max-w-none flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="font-medium">{tag}</Badge>
              ))}
              </div>
          )}
          <div className="w-full">
              <ClientMarkdownRenderer content={post.content} />
          </div>
      </CardContent>
    </Card>
  );
}

