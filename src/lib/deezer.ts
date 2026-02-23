// In dev, Vite proxies /api/deezer → api.deezer.com
// In production, use the Cloudflare Worker URL from VITE_DEEZER_PROXY_URL
const DEEZER_BASE =
	import.meta.env.VITE_DEEZER_PROXY_URL?.replace(/\/$/, "") || "/api/deezer";

interface DeezerArtist {
	id: number;
	name: string;
	picture_small: string;
	picture_medium: string;
	picture_big: string;
	picture_xl: string;
}

interface DeezerSearchResponse {
	data: DeezerArtist[];
}

export async function getArtistImage(
	artistName: string,
): Promise<string | null> {
	try {
		const url = `${DEEZER_BASE}/search/artist?q=${encodeURIComponent(artistName)}&limit=1`;
		const res = await fetch(url);
		if (!res.ok) return null;

		const data: DeezerSearchResponse = await res.json();
		const artist = data.data?.[0];
		if (!artist) return null;

		return (
			artist.picture_xl || artist.picture_big || artist.picture_medium || null
		);
	} catch {
		return null;
	}
}
