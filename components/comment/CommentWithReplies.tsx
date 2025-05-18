import { getCommentReplies } from "@/sanity/lib/comment/getCommentReplies";
import CommentUI from "./CommentUI";
import CommentList from "./CommentList";
import {
  GetCommentRepliesQueryResult,
  GetPostCommentsQueryResult,
} from "@/sanity.types";

// This is a server component that fetches data
async function CommentWithReplies({
  postId,
  comment,
  userId,
}: {
  postId: string;
  comment:
    | GetPostCommentsQueryResult[number]
    | GetCommentRepliesQueryResult[number];
  userId: string | null;
}) {
  // Fetch replies on the server
  const replies = await getCommentReplies(comment._id, userId);

  return (
    <div className="border-l border-border pl-4 py-2 my-2">
      {/* Pass comment data to the client UI component */}
      <CommentUI 
        comment={comment} 
        userId={userId}
        postId={postId}
      />
      
      {/* Recursively render replies if they exist */}
      {replies?.length > 0 && (
        <div className="mt-3 ps-2 border-s-2 border-border">
          <CommentList postId={postId} comments={replies} userId={userId} />
        </div>
      )}
    </div>
  );
}

export default CommentWithReplies; 