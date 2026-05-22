import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30 seconds default
      gcTime: 5 * 60 * 1000, // 5 minutes garbage collection cache
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
