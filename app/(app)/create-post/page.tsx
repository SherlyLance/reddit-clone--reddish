import CreateCommunityButton from "@/components/header/CreateCommunityButton";
import CreatePostForm from "@/components/post/CreatePostForm";
import { SubredditCombobox } from "@/components/subreddit/SubredditCombobox";
import { getSubreddits } from "@/sanity/lib/subreddit/getSubreddits";

async function CreatePostPage({
  searchParams,
}: {
  searchParams: Promise<{ subreddit: string }>;
}) {
  const { subreddit } = await searchParams;
  const subreddits = await getSubreddits();

  const commonBanner = (
    <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Post</h1>
            {subreddit ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Create a post in the{" "}
                <span className="font-bold text-gray-700 dark:text-gray-300">{subreddit}</span> community
              </p>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Select a community for your post
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );

  if (subreddit) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {commonBanner}
        <section className="my-8">
          {/* The CreatePostForm should ideally handle its own theming internally for card-like appearance */}
          <CreatePostForm />
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {commonBanner}
      <section className="my-8">
        <div className="mx-auto max-w-7xl px-4">
          {/* This part might need a card-like container if it doesn't have one */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
            <div className="max-w-3xl mx-auto">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Select a community to post in
              </label>
              <SubredditCombobox
                subreddits={subreddits}
                defaultValue={subreddit}
              />
              <hr className="my-4 border-gray-200 dark:border-gray-700" />
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                If you don&apos;t see your community, you can create it here.
              </p>
              <div className="mt-2">
                <CreateCommunityButton />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CreatePostPage;
