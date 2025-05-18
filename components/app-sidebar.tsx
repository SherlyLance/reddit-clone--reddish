import * as React from "react";
import { FlameIcon, HomeIcon, Minus, Plus, TrendingUpIcon, UsersIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { getSubreddits } from "@/sanity/lib/subreddit/getSubreddits";
import CreateCommunityButton from "./header/CreateCommunityButton";
import { urlFor } from "@/sanity/lib/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Subreddit {
  _id: string;
  title?: string | null;
  slug?: string | null;
  image?: object;
  memberCount?: number | null;
}

export async function AppSidebar({
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const subreddits: Subreddit[] = (await getSubreddits()) || [];

  return (
    <Sidebar className={`bg-background border-r border-border ${className}`} {...props}>
      <SidebarHeader className="border-b border-border">
        <SidebarMenu>
          {/* The following SidebarMenuItem containing the logo will be removed. */}
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="group-data-[collapsible=icon]:hidden">
                <CreateCommunityButton />
              </SidebarMenuButton>

              <SidebarMenuButton asChild className="p-5 hover:bg-accent hover:text-accent-foreground">
                <Link href="/" className="flex items-center">
                  <HomeIcon className="w-4 h-4 mr-3" />
                  Home
                </Link>
              </SidebarMenuButton>

              <SidebarMenuButton asChild className="p-5 hover:bg-accent hover:text-accent-foreground">
                <Link href="/?sort=popular" className="flex items-center">
                  <TrendingUpIcon className="w-4 h-4 mr-3" />
                  Popular
                </Link>
              </SidebarMenuButton>
              <SidebarMenuButton asChild className="p-5 hover:bg-accent hover:text-accent-foreground">
                <Link href="/?sort=hot" className="flex items-center">
                  <FlameIcon className="w-4 h-4 mr-3" />
                  Hot
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild className="p-5 hover:bg-accent hover:text-accent-foreground">
                        <Link href="/communities" className="flex items-center">
                            <UsersIcon className="w-4 h-4 mr-3" />
                            Browse Communities
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>

        {subreddits.length > 0 && (
          <SidebarGroup>
            <SidebarMenu>
                <Collapsible defaultOpen className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="hover:bg-accent hover:text-accent-foreground">
                        My Communities
                        <Plus className="ml-auto group-data-[state=open]/collapsible:hidden h-4 w-4" />
                        <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden h-4 w-4" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {subreddits.map((subreddit) => (
                          <SidebarMenuSubItem key={subreddit._id}>
                            <SidebarMenuSubButton
                              asChild
                              className="hover:bg-accent hover:text-accent-foreground pl-4 py-2 h-auto text-sm"
                            >
                              <Link href={`/community/${subreddit.slug}`} className="flex items-center w-full">
                                <Avatar className="w-6 h-6 mr-2">
                                  {subreddit.image && urlFor(subreddit.image)?.url() ? (
                                    <AvatarImage src={urlFor(subreddit.image).width(24).height(24).fit('crop').url()} alt={subreddit.title || 'avatar'} />
                                  ) : null}
                                  <AvatarFallback className="text-xs">
                                    {subreddit.title ? subreddit.title.charAt(0).toUpperCase() : 'C'}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <p className="truncate font-medium">c/{subreddit.title || "unknown"}</p>
                                  {subreddit.memberCount !== null && subreddit.memberCount !== undefined && (
                                    <p className="text-xs text-muted-foreground">{subreddit.memberCount} member{subreddit.memberCount === 1 ? '' : 's'}</p>
                                  )}
                                </div>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
