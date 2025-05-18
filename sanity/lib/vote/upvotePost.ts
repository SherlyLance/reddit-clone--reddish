import { defineQuery } from "next-sanity";
import { adminClient } from "../adminClient";
import { sanityFetch } from "../live";
import { updatePostCalculatedFields } from "./utils"; // Import the shared utility

export async function upvotePost(postId: string, userId: string) {
  const existingVoteQuery = defineQuery(
    `*[_type == "vote" && post._ref == $postId && user._ref == $userId][0]`
  );
  const existingVoteResult = await sanityFetch({ query: existingVoteQuery, params: { postId, userId }});
  const existingVote = existingVoteResult.data;

  let operationCompleted = false;

  if (existingVote) {
    if (existingVote.voteType === "upvote") {
      await adminClient.delete(existingVote._id);
      operationCompleted = true;
      console.log(`User ${userId} removed upvote for post ${postId}`);
    } else if (existingVote.voteType === "downvote") {
      await adminClient.patch(existingVote._id).set({ voteType: "upvote" }).commit();
      operationCompleted = true;
      console.log(`User ${userId} changed downvote to upvote for post ${postId}`);
    }
  } else {
    await adminClient.create({
      _type: "vote",
      post: { _type: "reference", _ref: postId },
      user: { _type: "reference", _ref: userId },
      voteType: "upvote",
      createdAt: new Date().toISOString(),
    });
    operationCompleted = true;
    console.log(`User ${userId} upvoted post ${postId}`);
  }

  if (operationCompleted) {
    await updatePostCalculatedFields(postId); // Use the shared utility
  }
  return { success: true, message: "Vote processed." }; 
}
