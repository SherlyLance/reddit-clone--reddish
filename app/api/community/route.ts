import { NextResponse } from 'next/server';
import { createCommunity } from '@/action/createCommunity';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required to create a community' }, 
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      name,
      slug,
      description,
      imageBase64,
      imageFilename,
      imageContentType,
    } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' }, 
        { status: 400 }
      );
    }

    const result = await createCommunity(
      name,
      imageBase64,
      imageFilename,
      imageContentType,
      slug,
      description
    );

    if ('error' in result) {
      return NextResponse.json(
        { error: result.error }, 
        { status: 400 }
      );
    }

    return NextResponse.json({ subreddit: result.subreddit });
  } catch (error) {
    console.error('Error in create community API:', error);
    return NextResponse.json(
      { error: 'Failed to create community' }, 
      { status: 500 }
    );
  }
} 