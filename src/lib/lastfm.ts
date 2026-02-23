import type {
	MusicProvider,
	RecentTrack,
	TopAlbum,
	TopArtist,
	TopTrack,
	UserInfo,
} from "../types";

const BASE = "https://ws.audioscrobbler.com/2.0/";

// ── Raw API types ───────────────────────────────────

interface LfmImage {
	"#text": string;
	size: string;
}

interface LfmUser {
	name: string;
	realname: string;
	image: LfmImage[];
	playcount: string;
	artist_count: string;
	track_count: string;
	album_count: string;
	registered: { unixtime: string };
	country: string;
	url: string;
}

interface LfmRecentTrack {
	name: string;
	artist: { "#text": string };
	album: { "#text": string };
	image: LfmImage[];
	date?: { uts: string };
	"@attr"?: { nowplaying: string };
	url: string;
}

interface LfmTopArtist {
	name: string;
	playcount: string;
	url: string;
}

interface LfmTopAlbum {
	name: string;
	playcount: string;
	artist: { name: string };
	image: LfmImage[];
	url: string;
}

interface LfmTopTrack {
	name: string;
	playcount: string;
	artist: { name: string };
	url: string;
}

// ── Helpers ─────────────────────────────────────────

function buildUrl(
	method: string,
	apiKey: string,
	params: Record<string, string> = {},
): string {
	const url = new URL(BASE);
	url.searchParams.set("method", method);
	url.searchParams.set("api_key", apiKey);
	url.searchParams.set("format", "json");
	for (const [k, v] of Object.entries(params)) {
		url.searchParams.set(k, v);
	}
	return url.toString();
}

async function fetchJson<T>(url: string): Promise<T> {
	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(`Last.fm API error: ${res.status} ${res.statusText}`);
	}
	return res.json() as Promise<T>;
}

function bestImage(images: LfmImage[]): string | null {
	if (!images?.length) return null;
	const sizes = ["extralarge", "mega", "large", "medium", "small"];
	for (const size of sizes) {
		const img = images.find((i) => i.size === size);
		if (img?.["#text"]) return img["#text"];
	}
	const any = images.find((i) => i["#text"]);
	return any?.["#text"] ?? null;
}

// ── Normalization ───────────────────────────────────

function normalizeUser(u: LfmUser): UserInfo {
	return {
		name: u.name,
		displayName: u.realname || u.name,
		avatarUrl: bestImage(u.image),
		playcount: Number.parseInt(u.playcount, 10) || 0,
		artistCount: Number.parseInt(u.artist_count, 10) || 0,
		trackCount: Number.parseInt(u.track_count, 10) || 0,
		albumCount: Number.parseInt(u.album_count, 10) || 0,
		registeredTimestamp: Number.parseInt(u.registered.unixtime, 10) || null,
		country: u.country ?? "",
		profileUrl: u.url,
	};
}

function normalizeRecentTrack(t: LfmRecentTrack): RecentTrack {
	return {
		name: t.name,
		artist: t.artist["#text"],
		album: t.album["#text"],
		imageUrl: bestImage(t.image),
		url: t.url,
		nowPlaying: t["@attr"]?.nowplaying === "true",
		playedAt: t.date ? Number.parseInt(t.date.uts, 10) : null,
	};
}

function normalizeTopArtist(a: LfmTopArtist): TopArtist {
	return {
		name: a.name,
		playcount: Number.parseInt(a.playcount, 10) || 0,
		url: a.url,
	};
}

function normalizeTopAlbum(a: LfmTopAlbum): TopAlbum {
	return {
		name: a.name,
		artist: a.artist.name,
		playcount: Number.parseInt(a.playcount, 10) || 0,
		imageUrl: bestImage(a.image),
		url: a.url,
	};
}

function normalizeTopTrack(t: LfmTopTrack): TopTrack {
	return {
		name: t.name,
		artist: t.artist.name,
		playcount: Number.parseInt(t.playcount, 10) || 0,
		url: t.url,
	};
}

// ── Provider ────────────────────────────────────────

export function createLastFmProvider(apiKey: string): MusicProvider {
	return {
		async getUserInfo(username) {
			const data = await fetchJson<{ user: LfmUser }>(
				buildUrl("user.getinfo", apiKey, { user: username }),
			);
			return normalizeUser(data.user);
		},

		async getRecentTracks(username, limit = 10) {
			const data = await fetchJson<{
				recenttracks: { track: LfmRecentTrack[] };
			}>(
				buildUrl("user.getrecenttracks", apiKey, {
					user: username,
					limit: String(limit),
				}),
			);
			return (data.recenttracks.track ?? []).map(normalizeRecentTrack);
		},

		async getTopArtists(username, period, limit = 12) {
			const data = await fetchJson<{
				topartists: { artist: LfmTopArtist[] };
			}>(
				buildUrl("user.gettopartists", apiKey, {
					user: username,
					period,
					limit: String(limit),
				}),
			);
			return (data.topartists.artist ?? []).map(normalizeTopArtist);
		},

		async getTopAlbums(username, period, limit = 8) {
			const data = await fetchJson<{
				topalbums: { album: LfmTopAlbum[] };
			}>(
				buildUrl("user.gettopalbums", apiKey, {
					user: username,
					period,
					limit: String(limit),
				}),
			);
			return (data.topalbums.album ?? []).map(normalizeTopAlbum);
		},

		async getTopTracks(username, period, limit = 10) {
			const data = await fetchJson<{
				toptracks: { track: LfmTopTrack[] };
			}>(
				buildUrl("user.gettoptracks", apiKey, {
					user: username,
					period,
					limit: String(limit),
				}),
			);
			return (data.toptracks.track ?? []).map(normalizeTopTrack);
		},
	};
}
