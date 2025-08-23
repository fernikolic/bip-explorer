import { useQuery } from "@tanstack/react-query";
import type { Bip } from "@shared/schema";

export function useBips() {
  return useQuery<Bip[]>({
    queryKey: ['/api/bips'],
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export function useBip(number: number) {
  return useQuery<Bip>({
    queryKey: ['/api/bips', number.toString()],
    enabled: !!number,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useBipsByAuthor(author: string) {
  return useQuery<Bip[]>({
    queryKey: ['/api/authors', author, 'bips'],
    enabled: !!author,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}
