import { NextResponse } from 'next/server';
import { joinCommunity } from '@/action/communityMembership';

export async function POST(
  req: Request,
  { params }: { params: { communityId: string } }
) {
  const { communityId } = params;
  const result = await joinCommunity(communityId);
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ membership: result.membership });
} 