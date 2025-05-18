import Post from "@/components/post/Post";
import { getPosts } from "@/sanity/lib/post/getPosts";
import { getPopularPosts } from "@/sanity/lib/post/getPopularPosts";
import { getHotPosts } from "@/sanity/lib/post/getHotPosts";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";

// Reusable component to display a list of posts
function DisplayPosts({ posts, userId }: { posts: any[]; userId: string | null }) {
  if (!posts || posts.length === 0) {
    return <p className="text-muted-foreground">No posts found.</p>;
  }
  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <Post key={post._id} post={post} userId={userId} />
      ))}
    </div>
  );
}

// Use the standard Next.js App Router page props pattern
export const dynamic = 'force-dynamic';

export default async function Home(props: any) {
  const { searchParams = {} } = props;
  const { userId } = await auth();
  const sort = searchParams.sort || "new";
  let posts: any[] = [];
  let pageTitle = "Recent posts from all communities";

  try {
    if (sort === "popular") {
      posts = await getPopularPosts();
      pageTitle = "Popular posts from all communities";
    } else if (sort === "hot") {
      posts = await getHotPosts();
      pageTitle = "Hot posts from all communities";
    } else { 
      posts = await getPosts();
    }
  } catch (error) {
    console.error("Error fetching posts for homepage:", error);
    // posts will remain empty, and "No posts found" will be shown by DisplayPosts
  }

  const getSortLinkClass = (currentSort: string) => {
    return cn(
      buttonVariants({ variant: "ghost" }),
      sort === currentSort 
        ? "bg-accent text-accent-foreground"
        : "hover:bg-accent/50"
    );
  };

  return (
    <>
      {/* Banner */}
      <section className="bg-background border-b border-border">
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Home</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {pageTitle}
              </p>
            </div>
            <div className="mt-3 sm:mt-0 flex items-center gap-1 sm:gap-2 flex-wrap">
              <Link href="/?sort=new" className={getSortLinkClass("new")}>New</Link>
              <Link href="/?sort=popular" className={getSortLinkClass("popular")}>Popular</Link>
              <Link href="/?sort=hot" className={getSortLinkClass("hot")}>Hot</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="my-4 sm:my-6 md:my-8">
        <div className="container mx-auto px-2 sm:px-4 md:px-6">
          <DisplayPosts posts={posts} userId={userId} />
        </div>
      </section>
    </>
  );
}
