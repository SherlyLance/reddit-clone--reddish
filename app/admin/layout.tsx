import React from 'react';
import { SanityLive } from "@/sanity/lib/live";
import { MemberCountProvider } from "@/context/MemberCountContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <MemberCountProvider>
        {children}
      </MemberCountProvider>
      <SanityLive />
    </div>
  );
} 