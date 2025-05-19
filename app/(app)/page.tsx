import PostsList from "@/components/post/PostsList";
import { getSubreddits } from "@/sanity/lib/subreddit/getSubreddits";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommunityCard } from "@/components/community/CommunityCard";
import { getUserJoinedCommunities } from "@/sanity/lib/user/getUserCommunities";
import { urlFor } from "@/sanity/lib/image";
import { HomeFeedTabs } from "@/components/home/HomeFeedTabs";
import { CommunitySidebar } from "@/components/community/CommunitySidebar";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

export default async function Home() {
  // Use a fixed sort value to avoid searchParams issues
  const sort = 'new'; // Default sort value

  try {
    // Get top communities for the sidebar with error handling
    let allCommunities = await getSubreddits();
    if (!allCommunities || !Array.isArray(allCommunities)) {
      console.error("Failed to fetch communities or data is not an array");
      allCommunities = [];
    }

    // Define a type for the community object
    interface Community {
      _id: string;
      title: string;
      slug: string;
      description?: string;
      image?: string;
      memberCount: number;
    }
    
    const topCommunities = allCommunities
      .sort((a: Community, b: Community) => (b.memberCount || 0) - (a.memberCount || 0))
      .slice(0, 5);

    // Get user's joined communities
    const userCommunitiesResult = await getUserJoinedCommunities();
    const userCommunities = "communities" in userCommunitiesResult 
      ? userCommunitiesResult.communities 
      : [];

    // Create a map of community IDs for quick lookup
    const userCommunityIds = new Set(
      Array.isArray(userCommunities) 
        ? userCommunities.map((community: { _id: string }) => community._id)
        : []
    );

    return (
      <>
        {/* Banner */}
        <section className="bg-card border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Home</h1>
                <p className="text-sm text-muted-foreground">
                  Recent posts from all communities
                </p>
              </div>
              <div className="hidden md:block">
                <HomeFeedTabs currentSort={sort} />
              </div>
            </div>
          </div>
        </section>

        {/* Posts */}
        <section className="my-8">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <div className="flex flex-col gap-4">
                  <div className="md:hidden mb-2">
                    <HomeFeedTabs currentSort={sort} />
                  </div>
                  <PostsList sort={sort} />
                </div>
              </div>

              {/* Sidebar with top communities */}
              <div className="hidden lg:block">
                {topCommunities.length > 0 ? (
                  <CommunitySidebar 
                    communities={topCommunities.map((community: Community) => ({
                      _id: community._id,
                      title: community.title,
                      slug: community.slug,
                      description: community.description,
                      image: community.image ? urlFor(community.image).url() : undefined,
                      memberCount: community.memberCount || 0
                    }))}
                    userCommunityIds={userCommunityIds}
                  />
                ) : (
                  <p>No communities available</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </>
    );
  } catch (error) {
    console.error("Error loading home page:", error);
    
    // Return a simplified version of the page when error occurs
    return (
      <>
        <section className="bg-card border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Home</h1>
                <p className="text-sm text-muted-foreground">
                  Recent posts from all communities
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="my-8">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-1 gap-6">
              <div className="flex flex-col gap-4">
                <PostsList sort={sort} />
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
}
