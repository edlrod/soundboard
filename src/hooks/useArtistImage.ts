import { useQuery } from "@tanstack/react-query";
import { getArtistImage } from "../lib/deezer";

export function useArtistImage(artistName: string) {
	return useQuery({
		queryKey: ["artistImage", artistName],
		queryFn: () => getArtistImage(artistName),
		enabled: !!artistName,
		staleTime: 24 * 60 * 60_000, // cache for 24h
		retry: 1,
	});
}
