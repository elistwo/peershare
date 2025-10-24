
"use client";

import { useArchive } from '@/hooks/use-archive';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import type { ActionButtonSettings, ArchiveDisplayOptions, PortalOptions, TagCloudOptions } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { BorderRadiusSlider } from './border-radius-slider';
import { ScrollArea } from './ui/scroll-area';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';

interface ArchiveSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArchiveSettings({ open, onOpenChange }: ArchiveSettingsProps) {
  const { activeArchive, updateArchive } = useArchive();

  if (!activeArchive || activeArchive.isOnline) {
    return null;
  }
  
  const handleDisplayOptionChange = <K extends keyof ArchiveDisplayOptions>(key: K, value: ArchiveDisplayOptions[K]) => {
    updateArchive(activeArchive.id, {
        displayOptions: {
            ...activeArchive.displayOptions,
            [key]: value,
        }
    });
  }

  const handlePortalOptionChange = <K extends keyof PortalOptions>(key: K, value: PortalOptions[K]) => {
    updateArchive(activeArchive.id, {
        displayOptions: {
            ...(activeArchive.displayOptions || {}),
            portalOptions: {
                ...(activeArchive.displayOptions?.portalOptions || {}),
                [key]: value,
            }
        }
    });
  }
  
  const handleTagCloudOptionChange = <K extends keyof TagCloudOptions>(key: K, value: TagCloudOptions[K]) => {
    updateArchive(activeArchive.id, {
        displayOptions: {
            ...(activeArchive.displayOptions || {}),
            tagCloudOptions: {
                ...(activeArchive.displayOptions?.tagCloudOptions || {}),
                [key]: value,
            }
        }
    });
  }

  const handleActionButtonChange = (key: keyof ActionButtonSettings, value: boolean) => {
    const currentActionButtons = activeArchive.displayOptions?.actionButtons || {};
    updateArchive(activeArchive.id, {
        displayOptions: {
            ...(activeArchive.displayOptions || {}),
            actionButtons: {
                ...currentActionButtons,
                [key]: value,
            },
        },
    });
  }

  const displayOptions = activeArchive.displayOptions || {};
  const portalOptions = displayOptions.portalOptions || {};
  const tagCloudOptions = displayOptions.tagCloudOptions || {};
  const actionButtons = {
    theme: true,
    archives: true,
    settings: true,
    import: true,
    export: true,
    newPost: true,
    ...(activeArchive.displayOptions?.actionButtons || {})
  };
  
  const actionButtonConfig: { key: keyof ActionButtonSettings, label: string }[] = [
    { key: 'theme', label: 'Theme Toggle' },
    { key: 'archives', label: 'Manage Archives' },
    { key: 'settings', label: 'Archive Settings' },
    { key: 'import', label: 'Import Archive' },
    { key: 'export', label: 'Export Archive' },
    { key: 'newPost', label: 'New Post' },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Archive Settings</SheetTitle>
          <SheetDescription>
            Manage the details and appearance of your local archive.
          </SheetDescription>
        </SheetHeader>
        <div className="py-6 space-y-6">
            <div className="space-y-4">
                <div className="space-y-1">
                    <Label htmlFor='archive-name' className="text-sm font-medium text-muted-foreground">Archive Name</Label>
                    <Input
                        id="archive-name"
                        value={activeArchive.name}
                        onChange={(e) => updateArchive(activeArchive.id, { name: e.target.value })}
                        className="text-2xl font-bold h-auto p-0 border-0 shadow-none focus-visible:ring-0"
                    />
                </div>
                <div className="space-y-1">
                    <Label htmlFor='archive-desc' className="text-sm font-medium text-muted-foreground">Description</Label>
                    <Input
                        id="archive-desc"
                        value={activeArchive.description}
                        onChange={(e) => updateArchive(activeArchive.id, { description: e.target.value })}
                        className="text-lg h-auto p-0 border-0 shadow-none focus-visible:ring-0"
                    />
                </div>
            </div>

            <Accordion type="multiple" defaultValue={['header-settings', 'layout-settings', 'action-buttons']} className="w-full">
              <AccordionItem value="header-settings">
                <AccordionTrigger>Header Settings</AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <Label>Show Header</Label>
                      <p className="text-xs text-muted-foreground">
                        Display the title and description.
                      </p>
                    </div>
                    <Switch
                      checked={displayOptions.showTitle !== false}
                      onCheckedChange={(value) => handleDisplayOptionChange('showTitle', value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Header Position</Label>
                     <Select
                        value={displayOptions.headerPosition || 'top'}
                        onValueChange={(value) => handleDisplayOptionChange('headerPosition', value)}
                        disabled={displayOptions.showTitle === false}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="top">Top</SelectItem>
                            <SelectItem value="hero">Hero</SelectItem>
                            <SelectItem value="bottom">Bottom</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Header Alignment</Label>
                     <Select
                        value={displayOptions.headerAlignment || 'center'}
                        onValueChange={(value) => handleDisplayOptionChange('headerAlignment', value)}
                        disabled={displayOptions.showTitle === false}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select alignment" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>

                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="layout-settings">
                <AccordionTrigger>Layout Settings</AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">

                   <div className="space-y-3">
                    <Label>Search Bar Position</Label>
                     <Select
                        value={displayOptions.searchBarPosition || 'top-center'}
                        onValueChange={(value) => handleDisplayOptionChange('searchBarPosition', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select search bar position" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="header">Header - Center</SelectItem>
                            <SelectItem value="header-left">Header - Left</SelectItem>
                            <SelectItem value="header-right">Header - Right</SelectItem>
                            <SelectItem value="top-center">Top of Content - Center</SelectItem>
                            <SelectItem value="top-left">Top of Content - Left</SelectItem>
                            <SelectItem value="top-right">Top of Content - Right</SelectItem>
                            <SelectItem value="floating-top-left">Floating - Top Left</SelectItem>
                            <SelectItem value="floating-top-right">Floating - Top Right</SelectItem>
                            <SelectItem value="floating-bottom-left">Floating - Bottom Left</SelectItem>
                            <SelectItem value="floating-bottom-right">Floating - Bottom Right</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Layout</Label>
                     <Select
                        value={displayOptions.layout || 'grid'}
                        onValueChange={(value) => handleDisplayOptionChange('layout', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select layout" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="grid">Grid</SelectItem>
                            <SelectItem value="portal-left">Portal (Left Sidebar)</SelectItem>
                            <SelectItem value="portal-right">Portal (Right Sidebar)</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Card Style</Label>
                    <RadioGroup 
                        value={displayOptions.cardStyle || 'default'}
                        onValueChange={(value) => handleDisplayOptionChange('cardStyle', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="default" id="style-default" />
                        <Label htmlFor="style-default">Default</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="default-overlay" id="style-default-overlay" />
                        <Label htmlFor="style-default-overlay">Default (Overlay)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="poster-classic" id="style-poster-classic" />
                        <Label htmlFor="style-poster-classic">Poster (Classic)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="poster-overlay" id="style-poster-overlay" />
                        <Label htmlFor="style-poster-overlay">Poster (Overlay)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                   <div className="space-y-3">
                    <Label>Image Fit</Label>
                    <RadioGroup
                        value={displayOptions.imageFit || 'cover'}
                        onValueChange={(value) => handleDisplayOptionChange('imageFit', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cover" id="fit-cover" />
                        <Label htmlFor="fit-cover">Cover</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="contain" id="fit-contain" />
                        <Label htmlFor="fit-contain">Contain</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label>Image Style</Label>
                    <RadioGroup
                        value={displayOptions.imageStyle || 'contained'}
                        onValueChange={(value) => handleDisplayOptionChange('imageStyle', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="contained" id="image-contained" />
                        <Label htmlFor="image-contained">Contained</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="full-bleed" id="image-full-bleed" />
                        <Label htmlFor="image-full-bleed">Full Bleed</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label>Border Radius</Label>
                    <BorderRadiusSlider
                        value={displayOptions.borderRadius}
                        onChange={(value) => handleDisplayOptionChange('borderRadius', value)}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
              {displayOptions.layout?.startsWith('portal') && (
                 <AccordionItem value="portal-settings">
                    <AccordionTrigger>Portal Settings</AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="portal-title">Sidebar Title</Label>
                          <Input
                            id="portal-title"
                            value={portalOptions.title || 'Featured Posts'}
                            onChange={(e) => handlePortalOptionChange('title', e.target.value)}
                          />
                        </div>

                        <div className="space-y-3">
                            <Label>Featured Posts</Label>
                            <ScrollArea className="h-48 w-full rounded-md border p-4">
                                {activeArchive.posts.map(post => (
                                    <div key={post.id} className="flex items-center space-x-2 mb-2">
                                        <Checkbox
                                            id={`featured-${post.id}`}
                                            checked={portalOptions.featuredPostIds?.includes(post.id)}
                                            onCheckedChange={(checked) => {
                                                const currentIds = portalOptions.featuredPostIds || [];
                                                const newIds = checked
                                                    ? [...currentIds, post.id]
                                                    : currentIds.filter(id => id !== post.id);
                                                handlePortalOptionChange('featuredPostIds', newIds);
                                            }}
                                        />
                                        <Label htmlFor={`featured-${post.id}`} className="font-normal truncate">{post.title}</Label>
                                    </div>
                                ))}
                            </ScrollArea>
                        </div>
                        
                        <div className="space-y-3">
                           <Label>Post Limit ({portalOptions.postLimit ?? activeArchive.posts.length})</Label>
                           <Slider
                                value={[portalOptions.postLimit ?? activeArchive.posts.length]}
                                onValueChange={(value) => handlePortalOptionChange('postLimit', value[0])}
                                max={activeArchive.posts.length}
                                step={1}
                           />
                        </div>

                        {tagCloudOptions.show !== false && 
                         tagCloudOptions.position === 'portal-sidebar' &&
                         portalOptions.featuredPostIds && portalOptions.featuredPostIds.length > 0 &&
                         (
                            <div className="space-y-3">
                                <Label>Sidebar Order</Label>
                                <Select
                                    value={portalOptions.sidebarOrder || 'posts-tags'}
                                    onValueChange={(value) => handlePortalOptionChange('sidebarOrder', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select order" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="posts-tags">Posts, then Tags</SelectItem>
                                        <SelectItem value="tags-posts">Tags, then Posts</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </AccordionContent>
                 </AccordionItem>
              )}
              <AccordionItem value="tag-cloud-settings">
                <AccordionTrigger>Tag Cloud Settings</AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                   <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                        <Label>Show Tag Cloud</Label>
                        <p className="text-xs text-muted-foreground">
                            Display the tag filtering block.
                        </p>
                        </div>
                        <Switch
                            checked={tagCloudOptions.show !== false}
                            onCheckedChange={(value) => handleTagCloudOptionChange('show', value)}
                        />
                    </div>
                    <div className="space-y-3">
                        <Label>Tag Cloud Position</Label>
                        <Select
                            value={tagCloudOptions.position || 'top-of-content'}
                            onValueChange={(value) => handleTagCloudOptionChange('position', value)}
                            disabled={tagCloudOptions.show === false}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select position" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="top-of-content">Top of Content</SelectItem>
                                <SelectItem value="bottom-of-content">Bottom of Content</SelectItem>
                                <SelectItem value="portal-sidebar">Portal Sidebar</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="tag-cloud-title">Tag Cloud Title</Label>
                        <Input
                            id="tag-cloud-title"
                            value={tagCloudOptions.title || 'Tags'}
                            onChange={(e) => handleTagCloudOptionChange('title', e.target.value)}
                            disabled={tagCloudOptions.show === false}
                        />
                    </div>
                </AccordionContent>
              </AccordionItem>
               <AccordionItem value="action-buttons">
                <AccordionTrigger>Action Buttons</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-3">
                    <Label>Action Buttons Position</Label>
                     <Select
                        value={displayOptions.actionButtonsPosition || 'bottom-right'}
                        onValueChange={(value) => handleDisplayOptionChange('actionButtonsPosition', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select action buttons position" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="bottom-right">Bottom Right</SelectItem>
                            <SelectItem value="bottom-left">Bottom Left</SelectItem>
                            <SelectItem value="bottom-center">Bottom Center</SelectItem>
                            <SelectItem value="top-right">Top Right</SelectItem>
                            <SelectItem value="top-left">Top Left</SelectItem>
                            <SelectItem value="top-center">Top Center</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                   <div className="space-y-3">
                    <Label>Display Mode</Label>
                    <RadioGroup 
                        value={displayOptions.actionButtonsDisplayMode || 'stacked'}
                        onValueChange={(value) => handleDisplayOptionChange('actionButtonsDisplayMode', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="stacked" id="fab-stacked" />
                        <Label htmlFor="fab-stacked">Stacked</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fab" id="fab-fab" />
                        <Label htmlFor="fab-fab">Floating Menu</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {actionButtonConfig.map(({ key, label }) => (
                     <div key={key} className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                        <Label htmlFor={`btn-${key}`}>{label}</Label>
                        <Switch
                          id={`btn-${key}`}
                          checked={actionButtons[key]}
                          onCheckedChange={(value) => handleActionButtonChange(key, value)}
                        />
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
}

    