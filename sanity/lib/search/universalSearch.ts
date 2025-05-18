import { sanityFetch } from "../live";
import { groq } from "next-sanity";

// Helper to prepare search terms for GROQ's match operator
const prepareSearchTerms = (query: string): string[] => {
  return query
    .toLowerCase()
    .split(" ")
    .filter((term) => term.trim() !== "")
    .map((term) => term + "**");
};

export async function universalSearch(query: string) {
  if (!query || query.trim() === "") {
    return { communities: [], posts: [], users: [] };
  }

  const searchTerms = prepareSearchTerms(query);

  // Define GROQ queries using match operator for search terms
  const communitiesQuery = groq`
    *[_type == "subreddit" && (
      title match $searchTerms || description match $searchTerms
    )] | score(
      title match $searchTerms || description match $searchTerms
    ) | order(score desc) {
      _id,
      title,
      "slug": slug.current,
      description
    }
  `;

  const postsQuery = groq`
    *[_type == "post" && !isDeleted && (
      title match $searchTerms || pt::text(body) match $searchTerms
    )] | score(
      title match $searchTerms || pt::text(body) match $searchTerms
    ) | order(score desc) {
      _id,
      title,
      "slug": slug.current,
      "communitySlug": subreddit->slug.current,
      "communityTitle": subreddit->title,
      "authorUsername": author->username,
      "authorImage": author->image,
      publishedAt,
      "excerpt": pt::text(body)
    }
  `;

  const usersQuery = groq`
    *[_type == "user" && (
      username match $searchTerms || name match $searchTerms
    )] | score(
      username match $searchTerms || name match $searchTerms
    ) | order(score desc) {
      _id,
      username,
      name,
      image
    }
  `;

  const params = { searchTerms }; // Pass search terms as a parameter

  try {
    const [communitiesResult, postsResult, usersResult] = await Promise.all([
      sanityFetch({ query: communitiesQuery, params, tags: ["subreddit"] }),
      sanityFetch({ query: postsQuery, params, tags: ["post", "subreddit"] }),
      sanityFetch({ query: usersQuery, params, tags: ["user"] }),
    ]);

    return {
      communities: communitiesResult.data || [],
      posts: postsResult.data || [],
      users: usersResult.data || [],
    };
  } catch (error) {
    console.error("Error during universal search:", error);
    return { communities: [], posts: [], users: [] };
  }
}