import { adminClient } from "../adminClient";

interface AddCommentParams {
  content: string;
  postId: string;
  userId: string; // This should be the Sanity user document ID
  parentCommentId?: string;
}

export async function addComment({
  content,
  postId,
  parentCommentId,
  userId,
}: AddCommentParams) {
  try {
    // Create comment document
    const commentData = {
      _type: "comment",
      content,
      author: {
        _type: "reference",
        _ref: userId,
      },
      post: {
        _type: "reference",
        _ref: postId,
      },
      parentComment: parentCommentId
        ? {
            _type: "reference",
            _ref: parentCommentId,
          }
        : undefined,
      createdAt: new Date().toISOString(),
    };

    // Create the comment in Sanity
    const comment = await adminClient.create(commentData);

    // After successfully creating the comment, increment the commentCount on the post
    if (comment && comment._id) {
      await adminClient
        .patch(postId)
        .inc({ commentCount: 1 })
        .commit({ autoGenerateArrayKeys: true });
      console.log(`Incremented comment count for post ${postId}`);
    } else {
      console.warn(`Comment creation might have failed for post ${postId}, not incrementing count.`);
    }

    return { comment };
  } catch (error) {
    console.error("Error adding comment:", error);
    // Consider if the commentCount increment should be reverted or handled differently on error
    return { error: "Failed to add comment" };
  }
}
