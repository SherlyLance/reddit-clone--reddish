import { defineQuery } from "next-sanity";
import { adminClient } from "../adminClient";
import { sanityFetch } from "../live";
import { updatePostCalculatedFields } from "./utils";

export async function downvotePost(postId: string, userId: string) {
  const existingVoteQuery = defineQuery(
    `*[_type == "vote" && post._ref == $postId && user._ref == $userId][0]`
  );
  const existingVoteResult = await sanityFetch({ query: existingVoteQuery, params: { postId, userId }});
  const existingVote = existingVoteResult.data;
  
  let operationCompleted = false;

  if (existingVote) {
    if (existingVote.voteType === "downvote") {
      await adminClient.delete(existingVote._id);
      operationCompleted = true;
      console.log(`User ${userId} removed downvote for post ${postId}`);
    } else if (existingVote.voteType === "upvote") {
      await adminClient.patch(existingVote._id).set({ voteType: "downvote" }).commit();
      operationCompleted = true;
      console.log(`User ${userId} changed upvote to downvote for post ${postId}`);
    }
  } else {
    await adminClient.create({
      _type: "vote",
      post: { _type: "reference", _ref: postId },
      user: { _type: "reference", _ref: userId },
      voteType: "downvote",
      createdAt: new Date().toISOString(),
    });
    operationCompleted = true;
    console.log(`User ${userId} downvoted post ${postId}`);
  }

  if (operationCompleted) {
    await updatePostCalculatedFields(postId);
  }
  return { success: true, message: "Vote processed." };
}
