"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface JoinCommunityButtonProps {
  communityId: string;
}

export default function JoinCommunityButton({ communityId }: JoinCommunityButtonProps) {
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isMember, setIsMember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkMembership = async () => {
      if (user) {
        const res = await fetch(`/api/community/${communityId}/membership`);
        const data = await res.json();
        const membershipStatus = data.isMember;
        setIsMember(membershipStatus);
      }
    };
    checkMembership();
  }, [user, communityId]);

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
        const res = await fetch(`/api/community/${communityId}/leave`, { method: 'POST' });
        const result = await res.json();
        if (result.error) {
          throw new Error(result.error);
        }
        setIsMember(false);
        toast({
          title: "Left community",
          description: "You have successfully left the community",
        });
      } else {
        const res = await fetch(`/api/community/${communityId}/join`, { method: 'POST' });
        const result = await res.json();
        if (result.error) {
          throw new Error(result.error);
        }
        setIsMember(true);
        toast({
          title: "Joined community",
          description: "You have successfully joined the community",
        });
      }
      router.refresh();
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
    >
      {isLoading ? "Loading..." : isMember ? "Leave" : "Join"}
    </Button>
  );
} 