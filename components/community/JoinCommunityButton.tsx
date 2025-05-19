"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { joinCommunity, leaveCommunity, isCommunityMember } from "@/action/communityMembership";
import { useToast } from "@/components/ui/use-toast";
import { useMemberCount } from "@/context/MemberCountContext";

interface JoinCommunityButtonProps {
  communityId: string;
  initialIsMember?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  onMembershipChange?: (isMember: boolean) => void;
}

export default function JoinCommunityButton({ 
  communityId, 
  initialIsMember = false, 
  size = "default",
  className = "",
  onMembershipChange
}: JoinCommunityButtonProps) {
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isMember, setIsMember] = useState(initialIsMember);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get the member count context
  const { incrementMemberCount, decrementMemberCount } = useMemberCount();

  useEffect(() => {
    // If initialIsMember is provided, use it as the initial state
    if (initialIsMember !== undefined) {
      setIsMember(initialIsMember);
    } else {
      // Otherwise, check membership status from the server
      const checkMembership = async () => {
        if (user) {
          const membershipStatus = await isCommunityMember(communityId);
          setIsMember(membershipStatus);
        }
      };
      checkMembership();
    }
  }, [user, communityId, initialIsMember]);

  const handleJoinLeave = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to join communities",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isMember) {
        const result = await leaveCommunity(communityId);
        if (result.error) {
          throw new Error(result.error);
        }
        setIsMember(false);
        
        // Update the member count in the context
        decrementMemberCount(communityId);
        
        // Notify parent component about membership change if callback exists
        if (onMembershipChange) {
          onMembershipChange(false);
        }
        toast({
          title: "Left community",
          description: "You have successfully left the community",
        });
      } else {
        const result = await joinCommunity(communityId);
        if (result.error) {
          throw new Error(result.error);
        }
        setIsMember(true);
        
        // Update the member count in the context
        incrementMemberCount(communityId);
        
        // Notify parent component about membership change if callback exists
        if (onMembershipChange) {
          onMembershipChange(true);
        }
        toast({
          title: "Joined community",
          description: "You have successfully joined the community",
        });
      }
      
      // Force revalidation of the current page and cache
      router.refresh();
      
      // Additional step: force navigation to the same page to ensure fresh data
      const currentPath = window.location.pathname;
      if (currentPath.includes('/community/')) {
        router.push(currentPath);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleJoinLeave}
      disabled={isLoading}
      variant={isMember ? "outline" : "default"}
      size={size}
      className={className}
    >
      {isLoading ? "Loading..." : isMember ? "Leave" : "Join"}
    </Button>
  );
} 