import Post from "@/components/post/Post";
import { urlFor } from "@/sanity/lib/image";
import { getPostsForSubreddit } from "@/sanity/lib/subreddit/getPostsForSubreddit";
import { getSubredditBySlug } from "@/sanity/lib/subreddit/getSubredditBySlug";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import JoinCommunityButton from "@/components/community/JoinCommunityButton";
import { getCommunityMembers } from "@/action/communityMembership";

async function CommunityPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const { userId } = await auth();
  const community = await getSubredditBySlug(slug);
  if (!community) return null;

  const posts = await getPostsForSubreddit(community._id);
  const members = await getCommunityMembers(community._id);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Community Banner */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4">
          {community?.image && community.image.asset?._ref && (
            <img
              className="w-16 h-16 rounded-full"
              src={urlFor(community.image).url()}
              alt={
                community.image.alt || `${community.title} community icon`
              }
            />
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{community?.title}</h1>
              <JoinCommunityButton communityId={community._id} />
            </div>
            {community?.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {community.description}
              </p>
            )}
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <span className="font-semibold">{members.length}</span> members
              </div>
              <div>
                <span className="font-semibold">{posts.length}</span> posts
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => <Post key={post._id} post={post} userId={userId} />)
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-500">No posts in this community yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommunityPage;
