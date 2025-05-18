"use client";

import { useState, useEffect, useCallback } from "react";
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

  const checkMembership = useCallback(async () => {
    if (user) {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/community/${communityId}/membership`, { 
          credentials: 'include',
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
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
      } finally {
        setIsLoading(false);
      }
    }
  }, [user, communityId, toast]);

  useEffect(() => {
    checkMembership();
  }, [checkMembership]);

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
      const action = isMember ? 'leave' : 'join';
      
      const response = await fetch(`/api/community/${communityId}/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        credentials: 'include',
        cache: 'no-cache'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Action failed");
      }

      // Immediately update UI state
      setIsMember(!isMember);
      
      // Force router to revalidate data
      router.refresh();
      
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
      
      // Re-check membership status from the server to ensure UI is in sync
      checkMembership();
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