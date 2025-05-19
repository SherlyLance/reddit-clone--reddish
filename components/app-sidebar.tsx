import * as React from "react";
import { FlameIcon, HomeIcon, Minus, Plus, TrendingUpIcon, UsersIcon } from "lucide-react";

import { SearchForm } from "@/components/search-form";
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
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import ReddishLogo from "@/images/Reddish Full.png";
import Link from "next/link";
import { getSubreddits } from "@/sanity/lib/subreddit/getSubreddits";
import CreateCommunityButton from "./header/CreateCommunityButton";
import { getUserJoinedCommunities } from "@/sanity/lib/user/getUserCommunities";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

// Define the Subreddit type
interface Subreddit {
  _id: string;
  title?: string;
  slug?: string;
  description?: string;
  image?: SanityImageSource;
  memberCount?: number;
}

type SidebarData = {
  navMain: {
    title: string;
    url: string;
    items: {
      title: string;
      url: string;
      isActive: boolean;
      image?: string;
      memberCount?: number;
    }[];
  }[];
};

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  // Get all subreddits from sanity
  const subreddits = await getSubreddits();
  
  // Get user's joined communities
  const userCommunitiesResult = await getUserJoinedCommunities();
  const userCommunities = "communities" in userCommunitiesResult 
    ? userCommunitiesResult.communities 
    : [];

  // Create a map of community IDs for quick lookup
  const userCommunityIds = new Set(
    userCommunities.map((community: { _id: string }) => community._id)
  );

  // This is sample data.
  const sidebarData: SidebarData = {
    navMain: [
      {
        title: "Browse Communities",
        url: "#",
        items:
          subreddits?.map((subreddit: Subreddit) => ({
            title: subreddit.title || "unknown",
            url: `/community/${subreddit.slug}`,
            isActive: false,
            image: subreddit.image,
            memberCount: subreddit.memberCount || 0,
          })) || [],
      },
      {
        title: "My Communities",
        url: "#",
        items:
          userCommunities?.map((community: { 
            title?: string;
            slug?: string;
            image?: { asset?: { _ref?: string } };
            memberCount?: number;
            _id: string;
          }) => ({
            title: community.title || "unknown",
            url: `/community/${community.slug}`,
            isActive: false,
            image: community.image,
            memberCount: community.memberCount || 0,
          })) || [],
      },
    ],
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <Image
                  src={ReddishLogo}
                  alt="logo"
                  width={150}
                  height={150}
                  className="object-contain transition-opacity duration-300"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <CreateCommunityButton />
              </SidebarMenuButton>

              <SidebarMenuButton asChild>
                <Link 
                  href="/?sort=new" 
                  className="flex items-center p-2 transition-colors hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-700"
                >
                  <HomeIcon className="w-4 h-4 mr-2" />
                  <span>Home</span>
                  <span className="text-xs text-muted-foreground ml-auto dark:text-gray-400">New</span>
                </Link>
              </SidebarMenuButton>

              <SidebarMenuButton asChild>
                <Link 
                  href="/?sort=popular" 
                  className="flex items-center p-2 transition-colors hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-700"
                >
                  <TrendingUpIcon className="w-4 h-4 mr-2" />
                  <span>Popular</span>
                  <span className="text-xs text-muted-foreground ml-auto dark:text-gray-400">Most liked</span>
                </Link>
              </SidebarMenuButton>
              
              <SidebarMenuButton asChild>
                <Link 
                  href="/?sort=hot" 
                  className="flex items-center p-2 transition-colors hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-700"
                >
                  <FlameIcon className="w-4 h-4 mr-2" />
                  <span>Hot</span>
                  <span className="text-xs text-muted-foreground ml-auto dark:text-gray-400">Most commented</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarMenu>
            {sidebarData.navMain.map((item, index) => (
              <Collapsible
                key={item.title}
                defaultOpen={index === 0 || (index === 1 && userCommunities.length > 0)}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <span className="flex items-center">
                        {item.title === "My Communities" && (
                          <UsersIcon className="w-4 h-4 mr-2" />
                        )}
                        {item.title}
                        {item.title === "My Communities" && userCommunities.length > 0 && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {userCommunities.length}
                          </Badge>
                        )}
                      </span>
                      <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((community) => (
                          <SidebarMenuSubItem key={community.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={community.isActive}
                            >
                              <Link href={community.url} className="flex items-center">
                                <Avatar className="h-6 w-6 mr-2 border border-border">
                                  <AvatarImage 
                                    src={community.image} 
                                    alt={community.title}
                                    className="object-cover"
                                  />
                                  <AvatarFallback className="bg-primary text-primary-foreground">
                                    {community.title.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="flex-1 truncate">{community.title}</span>
                                {(community.memberCount ?? 0) > 0 && (
                                  <Badge variant="outline" className="text-xs text-muted-foreground ml-2 px-1.5 py-0">
                                    {community.memberCount} {(community.memberCount ?? 0) === 1 ? 'member' : 'members'}
                                  </Badge>
                                )}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : (
                    <CollapsibleContent>
                      <div className="px-2 py-3 text-sm text-muted-foreground">
                        {item.title === "My Communities" 
                          ? "You haven't joined any communities yet." 
                          : "No communities found."}
                      </div>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
