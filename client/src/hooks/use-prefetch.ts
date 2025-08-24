import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { Bip } from "@shared/schema";

export function usePrefetchBips() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Prefetch BIPs data on component mount
    queryClient.prefetchQuery({
      queryKey: ['/api/bips'],
      staleTime: 1000 * 60 * 60, // 1 hour
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    });

    // Also prefetch stats
    queryClient.prefetchQuery({
      queryKey: ['/api/stats'],
      staleTime: 1000 * 60 * 60, // 1 hour
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    });
  }, [queryClient]);
}

export function usePrefetchBip(number: number) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (number) {
      queryClient.prefetchQuery({
        queryKey: ['/api/bips', number.toString()],
        staleTime: 1000 * 60 * 60, // 1 hour
      });
    }
  }, [queryClient, number]);
}

export function usePrefetchAuthor(author: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (author) {
      queryClient.prefetchQuery({
        queryKey: ['/api/authors', author, 'bips'],
        staleTime: 1000 * 60 * 30, // 30 minutes
      });
    }
  }, [queryClient, author]);
}