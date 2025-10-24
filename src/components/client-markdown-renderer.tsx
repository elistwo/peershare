"use client";

import { useEffect, useState } from 'react';
import { MarkdownRenderer, MarkdownRendererProps } from './markdown-renderer';

// This component acts as a wrapper to ensure that MarkdownRenderer, which uses
// browser-specific libraries, is only rendered on the client side.
export function ClientMarkdownRenderer(props: MarkdownRendererProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // On the server, and during the initial client render, we render a placeholder
  // to avoid hydration mismatch. The actual content will be rendered only on the client.
  if (!isClient) {
    return <div className="prose dark:prose-invert min-h-[120px]" />;
  }

  return <MarkdownRenderer {...props} />;
}
