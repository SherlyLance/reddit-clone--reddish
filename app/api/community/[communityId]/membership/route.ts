import { NextResponse } from 'next/server';
import { isCommunityMember } from '@/action/communityMembership';

export async function GET(
  req: Request,
  { params }: { params: { communityId: string } }
) {
  const { communityId } = params;
  const isMember = await isCommunityMember(communityId);
  return NextResponse.json({ isMember });
} 