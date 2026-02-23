import type { MusicProvider } from "../types";
import { createLastFmProvider } from "./lastfm";
import { createListenBrainzProvider } from "./listenbrainz";

export type ProviderType = "lastfm" | "listenbrainz";

const PROVIDER_TYPE: ProviderType =
	(import.meta.env.VITE_API_PROVIDER as ProviderType) === "listenbrainz"
		? "listenbrainz"
		: "lastfm";

const API_KEY = import.meta.env.VITE_LASTFM_API_KEY ?? "";

function createProvider(): MusicProvider | null {
	if (PROVIDER_TYPE === "listenbrainz") {
		return createListenBrainzProvider();
	}
	if (!API_KEY) return null;
	return createLastFmProvider(API_KEY);
}

export const provider = createProvider();
export const providerType = PROVIDER_TYPE;
export const isConfigured = provider !== null;

export const providerName = {
	lastfm: "last.fm",
	listenbrainz: "listenbrainz",
}[PROVIDER_TYPE];
export const providerUrl = {
	lastfm: "https://last.fm",
	listenbrainz: "https://listenbrainz.org/",
}[PROVIDER_TYPE];
