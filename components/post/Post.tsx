import {
  GetAllPostsQueryResult,
  GetPostsForSubredditQueryResult,
} from "@/sanity.types";
import { getPostComments } from "@/sanity/lib/vote/getPostComments";
import { getPostVotes } from "@/sanity/lib/vote/getPostVotes";
import { getUserPostVoteStatus } from "@/sanity/lib/vote/getUserPostVoteStatus";
import TimeAgo from "../TimeAgo";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { MessageSquare } from "lucide-react";
import CommentInput from "../comment/CommentInput";
import CommentList from "../comment/CommentList";
import PostVoteButtons from "./PostVoteButtons";
import ReportButton from "../ReportButton";
import DeleteButton from "../DeleteButton";

interface PostProps {
  post:
    | GetAllPostsQueryResult[number]
    | GetPostsForSubredditQueryResult[number];
  userId: string | null;
}

async function Post({ post, userId }: PostProps) {
  const votes = await getPostVotes(post._id);
  const vote = await getUserPostVoteStatus(post._id, userId);
  const comments = await getPostComments(post._id, userId);

  return (
    <article
      key={post._id}
      className="relative bg-card rounded-md shadow-sm border border-border hover:border-border/80 transition-colors w-full"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Vote Buttons - stack horizontally on mobile, vertically on larger screens */}
        <div className="sm:hidden w-full bg-muted/50 dark:bg-muted/10 p-2 rounded-t-md flex justify-center items-center space-x-4">
          <PostVoteButtons
            contentId={post._id}
            votes={votes}
            vote={vote}
            contentType="post"
          />
        </div>

        {/* Desktop vote buttons */}
        <div className="hidden sm:block">
          <PostVoteButtons
            contentId={post._id}
            votes={votes}
            vote={vote}
            contentType="post"
          />
        </div>

        {/* Post Content */}
        <div className="flex-1 p-3 md:p-4 w-full">
          {/* Post Header with proper spacing for action buttons */}
          <div className="relative mb-3">
            {/* Action buttons - positioned absolutely on larger screens */}
            <div className="sm:absolute sm:top-0 sm:right-0 sm:z-10 mb-2 sm:mb-0 flex justify-end">
              <div className="flex items-center gap-2">
                <ReportButton contentId={post._id} />

                {post.author?._id && (
                  <DeleteButton
                    contentOwnerId={post.author?._id}
                    contentId={post._id}
                    contentType="post"
                  />
                )}
              </div>
            </div>

            {/* Post metadata */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground sm:pr-20">
              {post.subreddit && (
                <>
                  <a
                    href={`/community/${post.subreddit.slug}`}
                    className="font-medium hover:underline"
                  >
                    c/{post.subreddit.title}
                  </a>
                  <span className="hidden xs:inline">•</span>
                  <span>Posted by</span>
                  {post.author && (
                    <a
                      href={`/u/${post.author.username}`}
                      className="hover:underline"
                    >
                      u/{post.author.username}
                    </a>
                  )}
                  <span className="hidden xs:inline">•</span>
                  {post.publishedAt && (
                    <TimeAgo date={new Date(post.publishedAt)} />
                  )}
                </>
              )}
            </div>
          </div>

          {post.subreddit && (
            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">
                {post.title}
              </h2>
            </div>
          )}

          {post.body && post.body[0]?.children?.[0]?.text && (
            <div className="prose prose-sm max-w-none text-muted-foreground mb-3 dark:prose-invert">
              {post.body[0].children[0].text}
            </div>
          )}

          {post.image && post.image.asset?._ref && (
            <div className="relative w-full h-48 sm:h-64 md:h-80 mb-3 bg-muted/30">
              <Image
                src={urlFor(post.image).url()}
                alt={post.image.alt || "Post image"}
                fill
                className="object-contain rounded-md p-2"
              />
            </div>
          )}

          <button className="flex items-center px-1 py-2 gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span>{comments.length} Comments</span>
          </button>

          <CommentInput postId={post._id} />
          <CommentList postId={post._id} comments={comments} userId={userId} />
        </div>
      </div>
    </article>
  );
}

export default Post;
