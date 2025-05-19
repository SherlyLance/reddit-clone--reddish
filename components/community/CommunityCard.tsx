"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersIcon } from "lucide-react";
import Link from "next/link";
import JoinCommunityButton from "./JoinCommunityButton";

interface CommunityCardProps {
  community: {
    _id: string;
    title: string;
    slug: string;
    description?: string;
    image?: string;
    memberCount?: number;
  };
  isMember?: boolean;
  className?: string;
}

export function CommunityCard({ community, isMember = false, className = "" }: CommunityCardProps) {
  return (
    <Card className={`w-full community-card ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={community.image} alt={community.title} />
            <AvatarFallback>
              {community.title.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base">
              <Link href={`/community/${community.slug}`} className="hover:underline">
                {community.title}
              </Link>
            </CardTitle>
            <CardDescription className="flex items-center text-xs">
              <UsersIcon className="h-3 w-3 mr-1" />
              {community.memberCount || 0} {(community.memberCount === 1) ? 'member' : 'members'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      {community.description && (
        <CardContent className="pb-2 pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {community.description}
          </p>
        </CardContent>
      )}
      <CardFooter className="pt-0">
        <JoinCommunityButton 
          communityId={community._id} 
          initialIsMember={isMember}
          className="w-full"
        />
      </CardFooter>
    </Card>
  );
}