import { NextResponse } from 'next/server';
import { isCommunityMember } from '@/action/communityMembership';
import { auth } from '@clerk/nextjs/server';

export async function GET(
  req: Request,
  { params }: { params: { communityId: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required', isMember: false }, 
        { 
          status: 401,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache'
          }
        }
      );
    }

    const { communityId } = params;
    
    if (!communityId) {
      return NextResponse.json(
        { error: 'Community ID is required', isMember: false }, 
        { 
          status: 400,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache'
          }
        }
      );
    }
    
    const isMember = await isCommunityMember(communityId);
    return NextResponse.json(
      { isMember },
      { 
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache'
        }
      }
    );
  } catch (error) {
    console.error('Error in check membership API:', error);
    return NextResponse.json(
      { error: 'Failed to check membership status', isMember: false }, 
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache'
        }
      }
    );
  }
}

// Add this to prevent caching
export const dynamic = 'force-dynamic'; 