// Type definitions for Next.js App Router
// Project: https://nextjs.org
// This file provides custom type declarations for Next.js App Router pages
// to help resolve TypeScript errors during build

import React from "react";

// Define a more flexible PageProps type that doesn't expect params to be a Promise
declare module "next" {
  export interface PageProps {
    params?: Record<string, any>;
    searchParams?: Record<string, string | string[] | undefined>;
  }
  
  // Other standard Next.js types can be added here if needed
}

// Make TypeScript recognize .tsx files as React components
declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
  }
} 