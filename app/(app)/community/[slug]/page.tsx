import Post from "@/components/post/Post";
import { urlFor } from "@/sanity/lib/image";
import { getPostsForSubreddit } from "@/sanity/lib/subreddit/getPostsForSubreddit";
import { getSubredditBySlug } from "@/sanity/lib/subreddit/getSubredditBySlug";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import JoinCommunityButton from "@/components/community/JoinCommunityButton";
import { isCommunityMember } from "@/action/communityMembership";
import { CommunityCard } from "@/components/community/CommunityCard";
import { UsersIcon } from "lucide-react";
import { GetPostsForSubredditQueryResult } from "@/sanity.types";

async function CommunityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const community = await getSubredditBySlug(slug);
  if (!community) return null;

  const user = await currentUser();
  const posts = await getPostsForSubreddit(community._id);
  
  // Check if user is a member of this community
  const isMember = user ? await isCommunityMember(community._id) : false;
  
  // Prepare community data for the card
  const communityData = {
    _id: community._id,
    title: community.title,
    slug: community.slug,
    description: community.description,
    image: community.image ? urlFor(community.image).url() : undefined,
    memberCount: community.memberCount || 0
  };

  return (
    <>
      {/* Community Banner */}
      <section className="bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {community?.image && community.image.asset?._ref && (
                <div className="relative h-16 w-16 overflow-hidden rounded-full border border-border">
                  <Image
                    src={urlFor(community.image).url()}
                    alt={
                      community.image.alt || `${community.title} community icon`
                    }
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-foreground">{community?.title}</h1>
                <div className="flex items-center text-sm text-muted-foreground">
                  <UsersIcon className="h-4 w-4 mr-1" />
                  {community.memberCount || 0} {(community.memberCount === 1) ? 'member' : 'members'}
                </div>
                {community?.description && (
                  <p className="text-sm text-muted-foreground mt-1">{community.description}</p>
                )}
              </div>
            </div>
            
            <div className="hidden md:block">
              <JoinCommunityButton 
                communityId={community._id} 
                initialIsMember={isMember}
                size="lg"
              />
            </div>
          </div>
          
          <div className="mt-4 md:hidden">
            <JoinCommunityButton 
              communityId={community._id} 
              initialIsMember={isMember}
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="my-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="flex flex-col gap-4">
                {posts.length > 0 ? (
                  posts.map((post: GetPostsForSubredditQueryResult[number]) => (
                    <Post key={post._id} post={post} userId={user?.id || null} />
                  ))
                ) : (
                  <div className="bg-card rounded-md p-6 text-center border border-border">
                    <p className="text-muted-foreground">No posts in this community yet.</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Sidebar with community info */}
            <div className="hidden lg:block">
              <div className="sticky top-4 space-y-4">
                <CommunityCard 
                  community={communityData}
                  isMember={isMember}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default CommunityPage;
