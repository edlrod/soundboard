import { formatDate, formatNumber } from "../lib/utils";
import type { RecentTrack, UserInfo } from "../types";
import { ImageWithFallback } from "./ImageWithFallback";

interface Props {
	user: UserInfo;
	recentTracks: RecentTrack[];
}

function NowPlaying({ track }: { track: RecentTrack }) {
	return (
		<div className="flex items-center gap-4 rounded-lg bg-card/60 border border-edge/40 px-5 py-4 backdrop-blur-sm">
			<div className="now-playing-bars shrink-0">
				<span />
				<span />
				<span />
				<span />
			</div>
			<ImageWithFallback
				src={track.imageUrl}
				alt={track.album || track.name}
				className="h-12 w-12 shrink-0"
			/>
			<div className="min-w-0">
				<p className="truncate font-medium text-primary text-sm">
					{track.name}
				</p>
				<p className="truncate text-muted text-xs">
					{track.artist}
					{track.album && (
						<span className="text-edge-light"> &mdash; {track.album}</span>
					)}
				</p>
			</div>
			<span className="ml-auto shrink-0 text-[10px] font-mono text-gold tracking-wider uppercase">
				Now Playing
			</span>
		</div>
	);
}

interface StatDef {
	key: string;
	label: string;
	getValue: (user: UserInfo) => string | null;
}

const STATS: StatDef[] = [
	{
		key: "playcount",
		label: "Scrobbles",
		getValue: (user) => formatNumber(user.playcount),
	},
	{
		key: "rate",
		label: "Scrobbles/Day",
		getValue: (user) => {
			if (user.registeredTimestamp) {
				const daysSinceRegistration = user.registeredTimestamp
					? Math.max(
							1,
							Math.floor(
								(Date.now() - user.registeredTimestamp * 1000) / 86_400_000,
							),
						)
					: null;
				const scrobblesPerDay =
					daysSinceRegistration !== null
						? (user.playcount / daysSinceRegistration).toFixed(1)
						: null;
				return scrobblesPerDay;
			}
			return null;
		},
	},
	{
		key: "artistCount",
		label: "Artists",
		getValue: (user) =>
			user.artistCount ? formatNumber(user.artistCount) : null,
	},
	{
		key: "trackCount",
		label: "Tracks",
		getValue: (user) =>
			user.trackCount ? formatNumber(user.trackCount) : null,
	},
	{
		key: "albumCount",
		label: "Albums",
		getValue: (user) =>
			user.albumCount ? formatNumber(user.albumCount) : null,
	},
];

export function ProfileHero({ user, recentTracks }: Props) {
	const nowPlaying = recentTracks.find((t) => t.nowPlaying);
	const memberSince = user.registeredTimestamp
		? formatDate(user.registeredTimestamp)
		: null;

	return (
		<section className="animate-fade-up">
			{/* Profile row */}
			<div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
				<ImageWithFallback
					src={user.avatarUrl}
					alt={user.name}
					round
					className="h-24 w-24 ring-2 ring-edge ring-offset-2 ring-offset-void shrink-0"
				/>
				<div className="flex flex-col gap-1.5">
					<h2 className="font-display text-4xl sm:text-5xl font-light italic text-primary tracking-wide">
						{user.displayName}
					</h2>
					<div className="flex items-center gap-3 text-sm text-muted">
						{user.displayName !== user.name && (
							<>
								<span className="font-mono text-secondary text-xs">
									@{user.name}
								</span>
								<span className="text-edge">&middot;</span>
							</>
						)}
						{memberSince && <span>Since {memberSince}</span>}
						{user.country && user.country !== "None" && (
							<>
								<span className="text-edge">&middot;</span>
								<span>{user.country}</span>
							</>
						)}
					</div>
				</div>
			</div>

			{/* Now Playing */}
			{nowPlaying && (
				<div
					className="mb-8 animate-fade-up"
					style={{ animationDelay: "100ms" }}
				>
					<NowPlaying track={nowPlaying} />
				</div>
			)}

			{/* Stats */}
			<div
				className="grid grid-cols-2 sm:grid-cols-5 gap-4"
				style={{ animationDelay: "200ms" }}
			>
				{STATS.map(({ key, label, getValue }, i) => {
					const value = getValue(user);
					if (value === null) return null;
					return (
						<div
							key={key}
							className="group rounded-lg bg-card/40 border border-edge/30 px-5 py-4 transition-colors hover:border-gold-dim hover:bg-card/60 animate-fade-up"
							style={{ animationDelay: `${200 + i * 80}ms` }}
						>
							<p className="font-mono text-2xl sm:text-3xl text-primary font-light tabular-nums tracking-tight">
								{value}
							</p>
							<p className="text-xs text-muted tracking-wider uppercase mt-1">
								{label}
							</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
