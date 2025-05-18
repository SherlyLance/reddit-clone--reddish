"use client";

import { UserCircle } from "lucide-react";
import TimeAgo from "../TimeAgo";
import CommentReply from "./CommentReply";
import ReportButton from "../ReportButton";
import DeleteButton from "../DeleteButton";
import { useState } from "react";

function CommentUI({ 
  comment, 
  userId,
  postId
}) {
  const [isReplying, setIsReplying] = useState(false);

  const handleReply = () => {
    setIsReplying(!isReplying);
  };

  return (
    <>
      <div className="relative mb-1">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground pr-24">
          <a href={`/u/${comment.author?.username}`} className="font-medium">
            u/{comment.author?.username}
          </a>
          <span>•</span>
          {comment.createdAt && <TimeAgo date={new Date(comment.createdAt)} />}
        </div>
        
        {/* Position buttons absolutely */}
        <div className="absolute top-0 right-0 z-10">
          <div className="flex items-center gap-2">
            <button onClick={handleReply} className="text-xs text-muted-foreground hover:text-foreground">
              Reply
            </button>
            
            <ReportButton contentId={comment._id} />
            
            {comment.author?._id === userId && (
              <DeleteButton
                contentOwnerId={comment.author?._id}
                contentId={comment._id}
                contentType="comment"
              />
            )}
          </div>
        </div>
      </div>
      
      <div className="text-sm mt-1">{comment.content}</div>

      {isReplying && <CommentReply postId={postId} comment={comment} />}
    </>
  );
}

export default CommentUI; 