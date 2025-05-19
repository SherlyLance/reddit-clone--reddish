import Post from "@/components/post/Post";
import { urlFor } from "@/sanity/lib/image";
import { getPostsForSubreddit } from "@/sanity/lib/subreddit/getPostsForSubreddit";
import { getSubredditBySlug } from "@/sanity/lib/subreddit/getSubredditBySlug";
import { currentUser, auth } from "@clerk/nextjs/server";
import Image from "next/image";
import JoinCommunityButton from "@/components/community/JoinCommunityButton";
import { isCommunityMember } from "@/action/communityMembership";
import { CommunityCard } from "@/components/community/CommunityCard";
import { CommunityBanner } from "@/components/community/CommunityBanner";
import { GetPostsForSubredditQueryResult } from "@/sanity.types";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Add cache: no-store to ensure fresh data on each request
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

async function CommunityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const community = await getSubredditBySlug(slug);
  if (!community) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <h1 className="text-2xl font-bold mb-4">Community Not Found</h1>
        <p className="text-muted-foreground">
          The community you're looking for doesn't exist or may have been removed.
        </p>
      </div>
    );
  }

  // Get user with auth() to handle authentication
  let user = null;
  try {
    const authData = await auth();
    if (authData?.userId) {
      user = await currentUser();
    }
  } catch (error) {
    console.error("Auth error:", error);
  }

  const posts = await getPostsForSubreddit(community._id);
  
  // Check if user is a member of this community (only if logged in)
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
      {/* Community Banner - Now using client component */}
      <Suspense fallback={<div className="h-48 bg-card border-b border-border animate-pulse" />}>
        <CommunityBanner 
          community={communityData}
          isMember={isMember}
          imageUrl={community?.image && community.image.asset?._ref 
            ? urlFor(community.image).url() 
            : undefined}
          imageAlt={community?.image?.alt || `${community.title} community icon`}
        />
      </Suspense>

      {/* Posts */}
      <section className="my-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Suspense fallback={
                <div className="flex flex-col gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-card rounded-md p-6 h-48 animate-pulse border border-border" />
                  ))}
                </div>
              }>
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
              </Suspense>
            </div>
            
            {/* Sidebar with community info */}
            <div className="hidden lg:block">
              <div className="sticky top-4 space-y-4">
                <Suspense fallback={<div className="bg-card rounded-md p-6 h-72 animate-pulse border border-border" />}>
                  <CommunityCard 
                    community={communityData}
                    isMember={isMember}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default CommunityPage;
