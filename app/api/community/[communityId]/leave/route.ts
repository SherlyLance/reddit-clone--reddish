import { NextResponse } from 'next/server';
import { leaveCommunity } from '@/action/communityMembership';

export async function POST(
  req: Request,
  { params }: { params: { communityId: string } }
) {
  const { communityId } = params;
  const result = await leaveCommunity(communityId);
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ success: true });
} 