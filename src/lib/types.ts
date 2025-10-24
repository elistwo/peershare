
export type Post = {
  id: string;
  title: string;
  author: string;
  createdAt: string; // ISO date string
  content: string; // Markdown content
  description?: string;
  tags?: string[];
  previewImageUrl?: string;
};

export type ActionButtonSettings = {
  theme?: boolean;
  archives?: boolean;
  settings?: boolean;
  import?: boolean;
  export?: boolean;
  newPost?: boolean;
}

export type BorderRadius = number | {
    tl: number;
    tr: number;
    br: number;
    bl: number;
};

export type PortalOptions = {
  title?: string;
  featuredPostIds?: string[];
  postLimit?: number;
  sidebarOrder?: 'posts-tags' | 'tags-posts';
};

export type TagCloudOptions = {
  show?: boolean;
  position?: 'top-of-content' | 'bottom-of-content' | 'portal-sidebar';
  title?: string;
}

export type ArchiveDisplayOptions = {
  layout?: 'grid' | 'portal-left' | 'portal-right';
  cardStyle?: 'default' | 'default-overlay' | 'poster-classic' | 'poster-overlay';
  imageFit?: 'cover' | 'contain';
  imageStyle?: 'contained' | 'full-bleed';
  borderRadius?: BorderRadius;
  searchBarPosition?: 'header' | 'header-left' | 'header-right' | 'top-center' | 'top-left' | 'top-right' | 'floating-top-left' | 'floating-top-right' | 'floating-bottom-left' | 'floating-bottom-right';
  showTitle?: boolean;
  headerPosition?: 'top' | 'hero' | 'bottom';
  headerAlignment?: 'left' | 'center' | 'right';
  actionButtons?: ActionButtonSettings;
  actionButtonsPosition?: 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' | 'top-left' | 'top-center';
  actionButtonsDisplayMode?: 'stacked' | 'fab';
  portalOptions?: PortalOptions;
  tagCloudOptions?: TagCloudOptions;
};

export type Archive = {
  id: string;
  name: string;
  description: string;
  posts: Post[];
  sourceUrl?: string; // URL if imported from the web
  isOnline?: boolean; // Flag to indicate if it's a web-based archive
  displayOptions?: ArchiveDisplayOptions;
};

    