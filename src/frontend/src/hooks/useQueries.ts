import { useQuery } from "@tanstack/react-query";
import type { Server } from "../backend.d.ts";
import { useActor } from "./useActor";

export type { Server };

export function useAllServers() {
  const { actor, isFetching } = useActor();
  return useQuery<Server[]>({
    queryKey: ["servers", "all"],
    queryFn: async () => {
      if (!actor) return [];
      await actor.initialize();
      return actor.getAllServers();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}
