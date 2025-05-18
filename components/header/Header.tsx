"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import ReddishLogo from "@/images/Reddish Full.png";
import ReddishLogoOnly from "@/images/Reddish Logo Only.png";
import { ChevronLeftIcon, MenuIcon, SearchIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSidebar } from "../ui/sidebar";
import CreatePost from "../post/CreatePost";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";

function Header() {
  const { toggleSidebar, open, isMobile } = useSidebar();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
      {/* Left Side - Restructured */}
      <div className="h-10 flex items-center gap-2">
        {/* Toggle Button -  Handles its own icon state based on sidebar's open state (and potentially isMobile) */}
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="p-0 h-6 w-6 md:h-auto md:w-auto">
            {open && !isMobile ? (
                <ChevronLeftIcon className="h-6 w-6" />
            ) : (
                <MenuIcon className="h-6 w-6" />
            )}
        </Button>

        {/* Logos - Rendered unless search is open, responsive classes handle md/sm visibility */}
        {!isSearchOpen && (
          <>
            <Link href="/">
              <Image
                src={ReddishLogo}
                alt="logo"
                width={150}
                height={150}
                className="hidden md:block cursor-pointer h-auto"
                style={{ width: '100px', height: 'auto' }} // Example fixed width for consistency
              />
            </Link>
            <Link href="/">
              <Image
                src={ReddishLogoOnly}
                alt="logo"
                width={32} // Adjusted for a slightly smaller icon logo if desired
                height={32}
                className="block md:hidden cursor-pointer h-auto"
              />
            </Link>
          </>
        )}
      </div>

      {/* Center: Search Input (conditionally rendered) */}
      {isSearchOpen && (
        <div className="flex-1 max-w-md mx-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Input 
              type="search"
              placeholder="Search communities, posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10"
            />
            <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
                <SearchIcon className="h-5 w-5" />
            </Button>
          </form>
        </div>
      )}

      {/* Right Side */}
      <div className="flex items-center gap-2">
        {!isSearchOpen && <ThemeToggle />} 
        
        {/* Search Icon/Close Icon */}
        <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
          {isSearchOpen ? <XIcon className="h-5 w-5" /> : <SearchIcon className="h-5 w-5" />}
        </Button>

        {!isSearchOpen && (
          <>
            <CreatePost />
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <Button asChild variant="outline">
                <SignInButton mode="modal" />
              </Button>
            </SignedOut>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
