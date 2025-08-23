import { useMemo } from "react";
import Fuse from "fuse.js";
import type { Bip } from "@shared/schema";

interface UseSearchProps {
  bips: Bip[];
  searchTerm: string;
  statusFilter: string;
  typeFilter: string;
  sortBy: string;
}

export function useSearch({
  bips,
  searchTerm,
  statusFilter,
  typeFilter,
  sortBy,
}: UseSearchProps) {
  const fuse = useMemo(() => {
    return new Fuse(bips, {
      keys: [
        { name: "number", weight: 0.3 },
        { name: "title", weight: 0.4 },
        { name: "authors", weight: 0.2 },
        { name: "abstract", weight: 0.1 },
      ],
      threshold: 0.4,
      includeScore: true,
    });
  }, [bips]);

  const searchResults = useMemo(() => {
    let results = bips;

    // Apply search term
    if (searchTerm.trim()) {
      // Check if search term is a number for BIP number search
      const bipNumber = parseInt(searchTerm.trim(), 10);
      if (!isNaN(bipNumber)) {
        results = bips.filter(bip => bip.number === bipNumber);
      } else {
        const fuseResults = fuse.search(searchTerm);
        results = fuseResults.map(result => result.item);
      }
    }

    // Apply status filter
    if (statusFilter && statusFilter !== "all") {
      results = results.filter(bip => bip.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter && typeFilter !== "all") {
      results = results.filter(bip => bip.type === typeFilter);
    }

    // Apply sorting
    results.sort((a, b) => {
      switch (sortBy) {
        case "number":
          return a.number - b.number;
        case "title":
          return a.title.localeCompare(b.title);
        case "created":
          return new Date(b.created).getTime() - new Date(a.created).getTime();
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return a.number - b.number;
      }
    });

    return results;
  }, [bips, fuse, searchTerm, statusFilter, typeFilter, sortBy]);

  const isSearching = searchTerm.trim().length > 0;

  return {
    searchResults,
    isSearching,
  };
}
