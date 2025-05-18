import { getSubreddits } from "@/sanity/lib/subreddit/getSubreddits";
import Link from "next/link";
// import { buttonVariants } from "@/components/ui/button"; // Not used directly, cn is used for potential future button
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListIcon, UsersIcon as CommunitiesIcon } from "lucide-react"; // Using UsersIcon as a more general communities icon
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { urlFor } from "@/sanity/lib/image";

// Define a more specific type for Subreddit data, consistent with AppSidebar
interface Subreddit {
  _id: string;
  title?: string | null;
  slug?: string | null;
  image?: any; // Or a more specific Sanity image type
  memberCount?: number | null;
  description?: string | null;
}

export default async function BrowseCommunitiesPage() {
  const communities: Subreddit[] = (await getSubreddits()) || [];

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
            <div className="text-center py-12">
              <ListIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">
                No communities found
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                It seems there are no communities created yet.
              </p>
              {/* Optional: Add a button to create a community if applicable */}
              {/* 
              <div className="mt-6">
                <Link href="/create-community" className={cn(buttonVariants({ variant: "default" }))}>
                  Create Community
                </Link>
              </div>
              */}
            </div>
          )}
        </div>
      </section>
    </>
  );
} 