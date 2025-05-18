import { universalSearch } from "@/sanity/lib/search/universalSearch";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, ListIcon, SearchIcon, UserIcon, FileTextIcon } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import Image from "next/image";
import ReddishPlaceholder from "@/images/Reddish Logo Only.png";

// Helper to truncate text
const truncateText = (text: string | null | undefined, maxLength: number): string => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const query = Array.isArray(searchParams?.q) ? searchParams.q[0] : searchParams?.q;

  if (!query || query.trim() === "") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center">
        <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Search Reddish
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter a term in the search bar above to find communities, posts, and users.
        </p>
      </div>
    );
  }

  const { communities, posts, users } = await universalSearch(query);

  const noResults =
    communities.length === 0 && posts.length === 0 && users.length === 0;

  return (
    <>
      <section className="bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <h1 className="text-2xl font-bold text-foreground">
            Search Results for &quot;{truncateText(query, 50)}&quot;
          </h1>
          <p className="text-sm text-muted-foreground">
            Showing results for your query.
          </p>
        </div>
      </section>

      <section className="my-8">
        <div className="mx-auto max-w-7xl px-4">
          {noResults ? (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium text-foreground">
                No results found for &quot;{truncateText(query, 50)}&quot;
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try searching for something else, or check your spelling.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Communities Section */}
              {communities.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <ListIcon className="mr-2 h-5 w-5" /> Communities
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {communities.map((community: any) => (
                      <Link key={community._id} href={`/community/${community.slug}`} legacyBehavior passHref>
                        <a className="block hover:no-underline">
                          <Card className="h-full hover:shadow-md transition-shadow duration-150 ease-in-out">
                            <CardHeader>
                              <CardTitle className="text-lg">r/{community.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {community.description || "No description."}
                              </p>
                            </CardContent>
                          </Card>
                        </a>
                      </Link>
                    ))}
                  </div>
                  <Separator className="my-6" />
                </div>
              )}

              {/* Posts Section */}
              {posts.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <FileTextIcon className="mr-2 h-5 w-5" /> Posts
                  </h2>
                  <div className="space-y-4">
                    {posts.map((post: any) => (
                      <Link 
                        key={post._id} 
                        href={`/community/${post.communitySlug}/post/${post.slug}`}
                        legacyBehavior 
                        passHref
                      >
                        <a className="block hover:no-underline">
                          <Card className="hover:shadow-md transition-shadow duration-150 ease-in-out">
                            <CardHeader>
                              <CardTitle className="text-lg">{post.title}</CardTitle>
                              <p className="text-xs text-muted-foreground">
                                Posted in r/{post.communityTitle || post.communitySlug} by u/{post.authorUsername} 
                                {post.publishedAt && ` • ${formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}`}
                              </p>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground line-clamp-3">
                                {truncateText(post.excerpt, 200) || "No content preview."}
                              </p>
                            </CardContent>
                          </Card>
                        </a>
                      </Link>
                    ))}
                  </div>
                  <Separator className="my-6" />
                </div>
              )}

              {/* Users Section */}
              {users.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <UserIcon className="mr-2 h-5 w-5" /> Users
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {users.map((user: any) => (
                      <Card key={user._id} className="text-center">
                        <CardContent className="pt-6 flex flex-col items-center">
                           <Image
                            src={user.image || ReddishPlaceholder.src}
                            alt={user.username || 'User avatar'}
                            width={64}
                            height={64}
                            className="rounded-full mx-auto mb-2 object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = ReddishPlaceholder.src }}
                          />
                          <p className="font-semibold text-sm">u/{user.username}</p>
                          {user.name && <p className="text-xs text-muted-foreground">{user.name}</p>}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
