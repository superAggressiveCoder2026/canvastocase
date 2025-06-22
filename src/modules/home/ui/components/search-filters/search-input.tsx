"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, ListFilterIcon, BookmarkCheckIcon  } from "lucide-react";
import { CategoriesSidebar } from "./categories-sidebar";
import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface Props {
  disabled?: boolean;
  
}

export const SearchInput = ({
  disabled,
  
}: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const trpc =useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());

  return (
    <div className="flex flex-wrap items-center gap-2 w-full">
      {/* Sidebar Trigger (Mobile) */}
      <Button
        variant="outline"
        className="size-10 p-2 flex lg:hidden"
        onClick={() => setIsSidebarOpen(true)}
      >
        <ListFilterIcon  />
      </Button>
      {session.data?.user&&(
        <Button 
          asChild
          variant="elevated"
        >
          <Link href="/library">
           <BookmarkCheckIcon/>
           library
          </Link>
        </Button>
      )}

      {/* Sidebar Component */}
      <CategoriesSidebar
      
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />

      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px] w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
        <Input
          className="pl-9 w-full"
          placeholder="Search products"
          disabled={disabled}
        />
      </div>
    </div>
  );
};
