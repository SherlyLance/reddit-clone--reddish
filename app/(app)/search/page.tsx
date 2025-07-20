// app/search/page.tsx

export const dynamic = 'force-dynamic';

import { searchSubreddits } from "@/sanity/lib/subreddit/searchSubreddits";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

// Define the Subreddit type
interface Subreddit {
  _id: string;
  title: string | null;
  slug: string | null;
  description: string | null;
  image: SanityImageSource | null;
  moderator: {
    _id: string;
    name: string;
  } | null;
  createdAt: string;
  memberCount?: number;
}

async function SearchPage({
  searchParams,
}: {
  // Minor adjustment for correctness: searchParams in App Router are typically
  // direct objects, not promises, for page components.
  searchParams: { query: string }; 
}) {
  const { query } = searchParams; // Removed 'await' here to match the updated type
  
  // Explicitly type the result of searchSubreddits as an array of Subreddit
  const subreddits: Subreddit[] = await searchSubreddits(query); 

  return (
    <>
      {/* Banner */}
      <section className="bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Search Results ({subreddits.length})
              </h1>
              <p className="text-sm text-muted-foreground">
                Communities matching &quot;{query}&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="my-8">
        <div className="mx-auto max-w-7xl px-4">
          <ul className="flex flex-col gap-4">
            {subreddits.map((subreddit: Subreddit) => ( // <--- ADDED : Subreddit HERE
              <li
                key={subreddit._id}
                className="border border-border rounded-lg overflow-hidden"
              >
                <Link
                  href={`/community/${subreddit.slug}`}
                  className="flex items-center cursor-pointer gap-4 py-5 px-4 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Avatar className="h-12 w-12 border-2 border-red-200 dark:border-red-800 shadow-sm">
                    {subreddit.image && (
                      <AvatarImage
                        src={urlFor(subreddit.image).url()}
                        className="object-contain"
                      />
                    )}
                    <AvatarFallback className="text-lg font-semibold bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200">
                      {subreddit.title?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-lg font-medium text-foreground">{subreddit.title}</h2>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {subreddit.description}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
            {subreddits.length === 0 && (
              <li className="py-8 text-center text-muted-foreground border border-border rounded-lg">
                No communities found matching your search.
              </li>
            )}
          </ul>
        </div>
      </section>
    </>
  );
}

export default SearchPage;