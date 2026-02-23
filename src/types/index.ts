export type Period =
	| "7day"
	| "1month"
	| "3month"
	| "6month"
	| "12month"
	| "overall";

export interface UserInfo {
	name: string;
	displayName: string;
	avatarUrl: string | null;
	playcount: number;
	artistCount: number | null;
	trackCount: number | null;
	albumCount: number | null;
	registeredTimestamp: number | null;
	country: string;
	profileUrl: string;
}

export interface RecentTrack {
	name: string;
	artist: string;
	album: string;
	imageUrl: string | null;
	url: string;
	nowPlaying: boolean;
	playedAt: number | null;
}

export interface TopArtist {
	name: string;
	playcount: number;
	url: string;
}

export interface TopAlbum {
	name: string;
	artist: string;
	playcount: number;
	imageUrl: string | null;
	url: string;
}

export interface TopTrack {
	name: string;
	artist: string;
	playcount: number;
	url: string;
}

export interface MusicProvider {
	getUserInfo(username: string): Promise<UserInfo>;
	getRecentTracks(username: string, limit?: number): Promise<RecentTrack[]>;
	getTopArtists(
		username: string,
		period: Period,
		limit?: number,
	): Promise<TopArtist[]>;
	getTopAlbums(
		username: string,
		period: Period,
		limit?: number,
	): Promise<TopAlbum[]>;
	getTopTracks(
		username: string,
		period: Period,
		limit?: number,
	): Promise<TopTrack[]>;
}

export interface SoundboardData {
	user: UserInfo | null;
	recentTracks: RecentTrack[];
	topArtists: TopArtist[];
	topAlbums: TopAlbum[];
	topTracks: TopTrack[];
}
