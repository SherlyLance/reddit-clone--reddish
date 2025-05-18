"use server";

import { client } from "@/sanity/lib/client";
import { adminClient } from "@/sanity/lib/adminClient";
import { getUser } from "@/sanity/lib/user/getUser";

export async function joinCommunity(communityId: string) {
  try {
    console.log("Joining community:", communityId);
    const user = await getUser();
    if ("error" in user) {
      console.log("Error in getUser:", user.error);
      return { error: "You must be logged in to join a community" };
    }
    const userId = user._id;
    console.log("User ID:", userId);

    // Check if already a member
    console.log("Checking if already a member");
    const existingMembership = await adminClient.fetch(
      `*[_type == "communityMembership" && user._ref == $userId && community._ref == $communityId][0]`,
      { userId, communityId }
    );
    console.log("Existing membership:", existingMembership);

    if (existingMembership) {
      return { error: "You are already a member of this community" };
    }

    // Create new membership
    console.log("Creating new membership");
    const membership = await adminClient.create({
      _type: "communityMembership",
      user: {
        _type: "reference",
        _ref: userId,
      },
      community: {
        _type: "reference",
        _ref: communityId,
      },
      role: "member",
      joinedAt: new Date().toISOString(),
    });
    console.log("Membership created:", membership);

    // Increment memberCount on the community document
    console.log("Incrementing member count");
    await adminClient
      .patch(communityId)
      .inc({ memberCount: 1 })
      .commit({ autoGenerateArrayKeys: true });
    console.log("Member count incremented");

    return { membership };
  } catch (error) {
    console.error("Error joining community:", error);
    return { error: "Failed to join community" };
  }
}

export async function leaveCommunity(communityId: string) {
  try {
    console.log("Leaving community:", communityId);
    const user = await getUser();
    if ("error" in user) {
      console.log("Error in getUser:", user.error);
      return { error: "You must be logged in to leave a community" };
    }
    const userId = user._id;
    console.log("User ID:", userId);

    // Find and delete membership
    console.log("Finding membership to delete");
    const membership = await adminClient.fetch(
      `*[_type == "communityMembership" && user._ref == $userId && community._ref == $communityId][0]`,
      { userId, communityId }
    );
    console.log("Found membership:", membership);

    if (!membership) {
      return { error: "You are not a member of this community" };
    }

    console.log("Deleting membership:", membership._id);
    await adminClient.delete(membership._id);
    console.log("Membership deleted");

    // Decrement memberCount on the community document
    console.log("Decrementing member count");
    await adminClient
      .patch(communityId)
      .dec({ memberCount: 1 })
      .commit({ autoGenerateArrayKeys: true });
    console.log("Member count decremented");

    return { success: true };
  } catch (error) {
    console.error("Error leaving community:", error);
    return { error: "Failed to leave community" };
  }
}

export async function isCommunityMember(communityId: string): Promise<boolean> {
  try {
    console.log("Checking if user is community member:", communityId);
    const user = await getUser();
    if ("error" in user) {
      console.log("Error in getUser:", user.error);
      return false;
    }
    const userId = user._id;
    console.log("User ID:", userId);

    const membership = await adminClient.fetch(
      `*[_type == "communityMembership" && user._ref == $userId && community._ref == $communityId][0]`,
      { userId, communityId }
    );
    console.log("Membership status:", !!membership);

    return !!membership;
  } catch (error) {
    console.error("Error checking community membership:", error);
    return false;
  }
}

export async function getCommunityMembers(communityId: string) {
  try {
    const members = await client.fetch(
      `*[_type == "communityMembership" && community._ref == $communityId]{
        _id,
        role,
        joinedAt,
        user->{
          _id,
          name,
          image
        }
      }`,
      { communityId }
    );

    return members;
  } catch (error) {
    console.error("Error fetching community members:", error);
    return [];
  }
} 