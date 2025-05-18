"use server";

import { client } from "@/sanity/lib/client";
import { adminClient } from "@/sanity/lib/adminClient";
import { getUser } from "@/sanity/lib/user/getUser";

export async function joinCommunity(communityId: string) {
  try {
    const user = await getUser();
    if ("error" in user) {
      return { error: "You must be logged in to join a community" };
    }
    const userId = user._id;

    // Check if already a member
    const existingMembership = await adminClient.fetch(
      `*[_type == "communityMembership" && user._ref == $userId && community._ref == $communityId][0]`,
      { userId, communityId }
    );

    if (existingMembership) {
      return { error: "You are already a member of this community" };
    }

    // Create new membership
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

    // Increment memberCount on the community document
    await adminClient
      .patch(communityId)
      .inc({ memberCount: 1 })
      .commit({ autoGenerateArrayKeys: true });

    return { membership };
  } catch (error) {
    console.error("Error joining community:", error);
    return { error: "Failed to join community" };
  }
}

export async function leaveCommunity(communityId: string) {
  try {
    const user = await getUser();
    if ("error" in user) {
      return { error: "You must be logged in to leave a community" };
    }
    const userId = user._id;

    // Find and delete membership
    const membership = await adminClient.fetch(
      `*[_type == "communityMembership" && user._ref == $userId && community._ref == $communityId][0]`,
      { userId, communityId }
    );

    if (!membership) {
      return { error: "You are not a member of this community" };
    }

    await adminClient.delete(membership._id);

    // Decrement memberCount on the community document
    await adminClient
      .patch(communityId)
      .dec({ memberCount: 1 })
      .commit({ autoGenerateArrayKeys: true });

    return { success: true };
  } catch (error) {
    console.error("Error leaving community:", error);
    return { error: "Failed to leave community" };
  }
}

export async function isCommunityMember(communityId: string): Promise<boolean> {
  try {
    const user = await getUser();
    if ("error" in user) return false;
    const userId = user._id;

    const membership = await adminClient.fetch(
      `*[_type == "communityMembership" && user._ref == $userId && community._ref == $communityId][0]`,
      { userId, communityId }
    );

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