import PostsList from "@/components/post/PostsList";

export default function Home() {
  return (
    <>
      {/* Banner */}
      <section className="bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Home</h1>
              <p className="text-sm text-muted-foreground">
                Recent posts from all communities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="my-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col gap-4">
            <PostsList />
          </div>
        </div>
      </section>
    </>
  );
}
