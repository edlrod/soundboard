import type {
	MusicProvider,
	Period,
	RecentTrack,
	TopAlbum,
	TopArtist,
	TopTrack,
} from "../types";

const BASE = "https://api.listenbrainz.org";

// ── Period mapping ──────────────────────────────────

const PERIOD_MAP: Record<Period, string> = {
	"7day": "week",
	"1month": "month",
	"3month": "quarter",
	"6month": "half_yearly",
	"12month": "year",
	overall: "all_time",
};

// ── Raw API types ───────────────────────────────────

interface LbListen {
	listened_at: number;
	track_metadata: {
		artist_name: string;
		track_name: string;
		release_name?: string;
		mbid_mapping?: {
			caa_id?: number;
			caa_release_mbid?: string;
			recording_mbid?: string;
			artist_mbids?: string[];
		};
	};
}

interface LbPlayingNow {
	playing_now: boolean;
	track_metadata: {
		artist_name: string;
		track_name: string;
		release_name?: string;
	};
}

interface LbTopArtist {
	artist_name: string;
	artist_mbids?: string[];
	listen_count: number;
}

interface LbTopRelease {
	artist_name: string;
	release_name: string;
	release_mbid?: string;
	caa_id?: number;
	caa_release_mbid?: string;
	listen_count: number;
}

interface LbTopRecording {
	artist_name: string;
	track_name: string;
	release_name?: string;
	recording_mbid?: string;
	listen_count: number;
}

// ── Helpers ─────────────────────────────────────────

async function fetchJson<T>(path: string): Promise<T> {
	const res = await fetch(`${BASE}${path}`);
	if (!res.ok) {
		throw new Error(`ListenBrainz API error: ${res.status} ${res.statusText}`);
	}
	return res.json() as Promise<T>;
}

function coverArtUrl(caaReleaseMbid?: string): string | null {
	if (!caaReleaseMbid) return null;
	return `https://coverartarchive.org/release/${caaReleaseMbid}/front-500`;
}

function mbArtistUrl(mbids?: string[]): string {
	if (mbids?.length) {
		return `https://musicbrainz.org/artist/${mbids[0]}`;
	}
	return "#";
}

// ── Provider ────────────────────────────────────────

export function createListenBrainzProvider(): MusicProvider {
	return {
		async getUserInfo(username) {
			const { payload } = await fetchJson<{
				payload: { count: number };
			}>(`/1/user/${encodeURIComponent(username)}/listen-count`);

			return {
				name: username,
				displayName: username,
				avatarUrl: null,
				playcount: payload.count,
				artistCount: null,
				trackCount: null,
				albumCount: null,
				registeredTimestamp: null,
				country: "",
				profileUrl: `https://listenbrainz.org/user/${username}/`,
			};
		},

		async getRecentTracks(username, limit = 10) {
			// Fetch recent listens and playing-now in parallel
			const [listensRes, playingRes] = await Promise.all([
				fetchJson<{
					payload: { listens: LbListen[] };
				}>(`/1/user/${encodeURIComponent(username)}/listens?count=${limit}`),
				fetchJson<{
					payload: { listens: LbPlayingNow[] };
				}>(`/1/user/${encodeURIComponent(username)}/playing-now`).catch(
					() => null,
				),
			]);

			const tracks: RecentTrack[] = [];

			// Add now playing if present
			const nowPlaying = playingRes?.payload?.listens?.[0];
			if (nowPlaying?.playing_now) {
				tracks.push({
					name: nowPlaying.track_metadata.track_name,
					artist: nowPlaying.track_metadata.artist_name,
					album: nowPlaying.track_metadata.release_name ?? "",
					imageUrl: null,
					url: `https://listenbrainz.org/user/${username}/`,
					nowPlaying: true,
					playedAt: null,
				});
			}

			// Add recent listens
			for (const listen of listensRes.payload.listens) {
				tracks.push({
					name: listen.track_metadata.track_name,
					artist: listen.track_metadata.artist_name,
					album: listen.track_metadata.release_name ?? "",
					imageUrl: coverArtUrl(
						listen.track_metadata.mbid_mapping?.caa_release_mbid,
					),
					url: listen.track_metadata.mbid_mapping?.recording_mbid
						? `https://musicbrainz.org/recording/${listen.track_metadata.mbid_mapping.recording_mbid}`
						: `https://listenbrainz.org/user/${username}/`,
					nowPlaying: false,
					playedAt: listen.listened_at,
				});
			}

			return tracks;
		},

		async getTopArtists(username, period, limit = 12) {
			const range = PERIOD_MAP[period];
			const { payload } = await fetchJson<{
				payload: { artists: LbTopArtist[] };
			}>(
				`/1/stats/user/${encodeURIComponent(username)}/artists?range=${range}&count=${limit}`,
			);

			return (payload.artists ?? []).map(
				(a): TopArtist => ({
					name: a.artist_name,
					playcount: a.listen_count,
					url: mbArtistUrl(a.artist_mbids),
				}),
			);
		},

		async getTopAlbums(username, period, limit = 8) {
			const range = PERIOD_MAP[period];
			const { payload } = await fetchJson<{
				payload: { releases: LbTopRelease[] };
			}>(
				`/1/stats/user/${encodeURIComponent(username)}/releases?range=${range}&count=${limit}`,
			);

			return (payload.releases ?? []).map(
				(r): TopAlbum => ({
					name: r.release_name,
					artist: r.artist_name,
					playcount: r.listen_count,
					imageUrl: coverArtUrl(r.caa_release_mbid),
					url: r.release_mbid
						? `https://musicbrainz.org/release/${r.release_mbid}`
						: "#",
				}),
			);
		},

		async getTopTracks(username, period, limit = 10) {
			const range = PERIOD_MAP[period];
			const { payload } = await fetchJson<{
				payload: { recordings: LbTopRecording[] };
			}>(
				`/1/stats/user/${encodeURIComponent(username)}/recordings?range=${range}&count=${limit}`,
			);

			return (payload.recordings ?? []).map(
				(r): TopTrack => ({
					name: r.track_name,
					artist: r.artist_name,
					playcount: r.listen_count,
					url: r.recording_mbid
						? `https://musicbrainz.org/recording/${r.recording_mbid}`
						: "#",
				}),
			);
		},
	};
}
