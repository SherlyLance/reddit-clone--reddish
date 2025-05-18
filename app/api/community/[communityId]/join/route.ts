import { NextResponse } from 'next/server';
import { joinCommunity } from '@/action/communityMembership';
import { auth } from '@clerk/nextjs/server';

export async function POST(
  req: Request,
  { params }: { params: { communityId: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }

    const { communityId } = params;
    
    if (!communityId) {
      return NextResponse.json(
        { error: 'Community ID is required' }, 
        { status: 400 }
      );
    }
    
    const result = await joinCommunity(communityId);
    
    if ('error' in result) {
      return NextResponse.json(
        { error: result.error }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json({ membership: result.membership });
  } catch (error) {
    console.error('Error in join community API:', error);
    return NextResponse.json(
      { error: 'Failed to join community' }, 
      { status: 500 }
    );
  }
} 