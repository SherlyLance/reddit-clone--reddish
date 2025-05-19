import { fixAllCommunityMemberCounts, fixCommunityMemberCount } from "@/action/fixCommunityMemberCount";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Only allow authenticated requests
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if we're fixing a specific community
    const searchParams = request.nextUrl.searchParams;
    const communityId = searchParams.get("communityId");

    let result;
    if (communityId) {
      // Fix specific community
      result = await fixCommunityMemberCount(communityId);
    } else {
      // Fix all communities
      result = await fixAllCommunityMemberCounts();
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in fix-member-counts API:", error);
    return NextResponse.json(
      { error: "Failed to fix member counts" },
      { status: 500 }
    );
  }
} 