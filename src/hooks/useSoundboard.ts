import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { isConfigured, provider } from "../lib/provider";
import type { Period } from "../types";

const VALID_PERIODS: Period[] = [
	"7day",
	"1month",
	"3month",
	"6month",
	"12month",
	"overall",
];
const DEFAULT_PERIOD: Period = VALID_PERIODS.includes(
	import.meta.env.VITE_DEFAULT_PERIOD as Period,
)
	? (import.meta.env.VITE_DEFAULT_PERIOD as Period)
	: "overall";

export function useSoundboard(username: string) {
	const [period, setPeriod] = useState<Period>(DEFAULT_PERIOD);

	const enabled = Boolean(username && provider);

	const p = provider;

	const user = useQuery({
		queryKey: ["user", username],
		queryFn: () =>
			p?.getUserInfo(username) ?? Promise.reject(new Error("No provider")),
		enabled,
		staleTime: 5 * 60_000,
	});

	const recentTracks = useQuery({
		queryKey: ["recentTracks", username],
		queryFn: () =>
			p?.getRecentTracks(username) ?? Promise.reject(new Error("No provider")),
		enabled,
		refetchInterval: 30_000,
	});

	const topArtists = useQuery({
		queryKey: ["topArtists", username, period],
		queryFn: () =>
			p?.getTopArtists(username, period) ??
			Promise.reject(new Error("No provider")),
		enabled,
		staleTime: 60_000,
	});

	const topAlbums = useQuery({
		queryKey: ["topAlbums", username, period],
		queryFn: () =>
			p?.getTopAlbums(username, period) ??
			Promise.reject(new Error("No provider")),
		enabled,
		staleTime: 60_000,
	});

	const topTracks = useQuery({
		queryKey: ["topTracks", username, period],
		queryFn: () =>
			p?.getTopTracks(username, period) ??
			Promise.reject(new Error("No provider")),
		enabled,
		staleTime: 60_000,
	});

	const loading = user.isLoading;
	const periodLoading =
		topArtists.isFetching || topAlbums.isFetching || topTracks.isFetching;
	const error =
		user.error ??
		recentTracks.error ??
		topArtists.error ??
		topAlbums.error ??
		topTracks.error;

	function retry() {
		user.refetch();
		recentTracks.refetch();
		topArtists.refetch();
		topAlbums.refetch();
		topTracks.refetch();
	}

	return {
		data: {
			user: user.data ?? null,
			recentTracks: recentTracks.data ?? [],
			topArtists: topArtists.data ?? [],
			topAlbums: topAlbums.data ?? [],
			topTracks: topTracks.data ?? [],
		},
		loading,
		periodLoading,
		error: error?.message ?? null,
		period,
		setPeriod,
		retry,
	};
}

export { isConfigured };
export const envUsername =
	import.meta.env.VITE_USERNAME ?? import.meta.env.VITE_LASTFM_USERNAME ?? "";
