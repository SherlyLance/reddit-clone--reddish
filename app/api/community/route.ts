import { NextResponse } from 'next/server';
import { createCommunity } from '@/action/createCommunity';

export async function POST(req: Request) {
  const {
    name,
    slug,
    description,
    imageBase64,
    imageFilename,
    imageContentType,
  } = await req.json();

  const result = await createCommunity(
    name,
    imageBase64,
    imageFilename,
    imageContentType,
    slug,
    description
  );

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ subreddit: result.subreddit });
} 