
"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TagCloudProps {
    tags: string[];
    selectedTag: string | null;
    onTagSelect: (tag: string | null) => void;
    title?: string;
    isCard?: boolean;
}

export function TagCloud({ tags, selectedTag, onTagSelect, title = "Tags", isCard = false }: TagCloudProps) {

    const content = (
         <div className="flex flex-wrap items-center justify-center gap-2">
            {tags.map(tag => (
                <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "secondary"}
                onClick={() => onTagSelect(selectedTag === tag ? null : tag)}
                className="cursor-pointer transition-transform hover:scale-105"
                >
                {tag}
                </Badge>
            ))}
            {selectedTag && (
                <Button variant="ghost" size="sm" onClick={() => onTagSelect(null)} className="flex items-center gap-1 text-sm">
                <X className="h-3 w-3" />
                Clear filter
                </Button>
            )}
        </div>
    );
    
    if (isCard) {
        return (
            <Card className="bg-card/50">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    {content}
                </CardContent>
            </Card>
        );
    }
    
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>
            {content}
        </div>
    );
}
