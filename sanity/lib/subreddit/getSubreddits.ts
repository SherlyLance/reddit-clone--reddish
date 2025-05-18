import { sanityFetch } from "../live";
import { defineQuery } from "groq";

export async function getSubreddits() {
  const getSubredditsQuery = defineQuery(`*[_type == "subreddit"] {
        _id,
        title,
        description,
        "slug": slug.current,
        image,
        memberCount,
        "moderator": moderator->username,
        createdAt
      } | order(createdAt desc)`);

  const subreddits = await sanityFetch({ query: getSubredditsQuery, tags: ["subreddit"] });

  return subreddits.data;
}
