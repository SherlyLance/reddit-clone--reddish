import { defineField, defineType } from "sanity";
import { FileText } from "lucide-react";

export const postType = defineType({
  name: "post",
  title: "Post",
  type: "document",
  icon: FileText,
  description: "A user-submitted post in a subreddit",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The title of the post",
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
      description: "The unique URL-friendly identifier for the post, generated from the title."
    }),
    defineField({
      name: "originalTitle",
      title: "Original Title",
      type: "string",
      description: "Stores the original title if the post is deleted",
      hidden: true,
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      description: "The user who created this post",
      to: [{ type: "user" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subreddit",
      title: "Subreddit",
      type: "reference",
      description: "The subreddit this post belongs to",
      to: [{ type: "subreddit" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      description: "The main content of the post",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description: "Optional image for the post",
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text",
          description: "Alternative text for screen readers and SEO",
        },
      ],
    }),
    defineField({
      name: "upvoteCount",
      title: "Upvote Count",
      type: "number",
      description: "Number of upvotes this post has received",
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: "downvoteCount",
      title: "Downvote Count",
      type: "number",
      description: "Number of downvotes this post has received",
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: "score",
      title: "Score",
      type: "number",
      description: "Calculated score (upvotes - downvotes)",
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: "commentCount",
      title: "Comment Count",
      type: "number",
      description: "Number of comments on this post",
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: "isReported",
      title: "Is Reported",
      type: "boolean",
      description: "Indicates if this post has been reported by users",
      initialValue: false,
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      description: "When this post was published",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "isDeleted",
      title: "Is Deleted",
      type: "boolean",
      description: "Indicates if this post has been deleted",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "author.username",
      media: "image",
      score: "score",
      upvoteCount: "upvoteCount",
      commentCount: "commentCount",
    },
    prepare({ title, subtitle, media, score, upvoteCount, commentCount }) {
      return {
        title: `${title} (Score: ${score || 0})`,
        subtitle: `${subtitle || 'User'} • ${upvoteCount || 0} upvotes • ${commentCount || 0} comments`,
        media,
      };
    },
  },
});
