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
        try {
          const res = await fetch(`/api/community/${communityId}/membership`, { credentials: 'include' });
          if (!res.ok) throw new Error('Failed to check membership status');
          const data = await res.json();
          setIsMember(data.isMember);
        } catch (error) {
          console.error('Error checking membership:', error);
          toast({
            title: "Error",
            description: "Could not check your membership status",
            variant: "destructive",
          });
        }
      }
    };
    checkMembership();
  }, [user, communityId, toast]);

  const handleJoinLeave = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to join or leave a community",
      });
      return;
    }

    setIsLoading(true);

    try {
      let response;
      if (isMember) {
        // Leave community
        response = await fetch(`/api/community/${communityId}/leave`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: 'include',
        });
      } else {
        // Join community
        response = await fetch(`/api/community/${communityId}/join`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: 'include',
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Action failed");
      }

      // Toggle membership state on success
      setIsMember(!isMember);
      
      toast({
        title: isMember ? "Left community" : "Joined community",
        description: isMember
          ? "You have successfully left the community"
          : "You have successfully joined the community",
      });
    } catch (error) {
      console.error("Join/Leave error:", error);
      toast({
        title: "Action failed",
        description: error instanceof Error ? error.message : "Could not process your request",
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