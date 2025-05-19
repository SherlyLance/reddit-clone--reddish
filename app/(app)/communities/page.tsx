import { getSubreddits } from "@/sanity/lib/subreddit/getSubreddits";
import { Subreddit } from "@/sanity.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { CommunitiesIcon } from "@/components/icons/CommunitiesIcon";
import { urlFor } from "@/sanity/lib/image";
import { Suspense } from "react";

// Define extended type that includes memberCount
interface SubredditWithMemberCount extends Subreddit {
  memberCount?: number;
}

// Add cache: no-store to ensure fresh data on each request
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

// Loading fallback component
function CommunitiesLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="h-48 animate-pulse">
          <CardHeader className="flex flex-row items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-muted" />
            <div className="flex-1">
              <div className="h-5 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-1/4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-5/6" />
              <div className="h-3 bg-muted rounded w-4/6" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default async function BrowseCommunitiesPage() {
  const communities: SubredditWithMemberCount[] = (await getSubreddits()) || [];

  return (
    <>
      <section className="bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <h1 className="text-2xl font-bold text-foreground flex items-center">
            <CommunitiesIcon className="mr-3 h-7 w-7" /> Browse Communities
          </h1>
          <p className="text-sm text-muted-foreground ml-10">
            Discover all communities on Reddish.
          </p>
        </div>
      </section>

      <section className="my-8">
        <div className="mx-auto max-w-7xl px-4">
          <Suspense fallback={<CommunitiesLoading />}>
            {communities && communities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {communities.map((community) => (
                  <Link key={community._id} href={`/community/${community.slug}`} className="block hover:no-underline">
                    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200 ease-in-out">
                      <CardHeader className="flex flex-row items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          {community.image && urlFor(community.image)?.url() ? (
                            <AvatarImage src={urlFor(community.image).width(48).height(48).fit('crop').url()} alt={community.title || 'avatar'} />
                          ) : null}
                          <AvatarFallback className="text-lg">
                            {community.title ? community.title.charAt(0).toUpperCase() : 'C'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-xl truncate">
                            c/{community.title}
                          </CardTitle>
                          {community.memberCount !== null && community.memberCount !== undefined && (
                            <p className="text-xs text-muted-foreground">
                              {community.memberCount} member{community.memberCount === 1 ? '' : 's'}
                            </p>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {community.description || "No description available."}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-card rounded-lg border border-border">
                <h2 className="text-xl font-medium mb-2">No Communities Yet</h2>
                <p className="text-muted-foreground mb-4">
                  Be the first to create a community and start connecting with others!
                </p>
              </div>
            )}
          </Suspense>
        </div>
      </section>
    </>
  );
} 