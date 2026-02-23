import { timeAgo } from "../lib/utils";
import type { RecentTrack } from "../types";
import { ImageWithFallback } from "./ImageWithFallback";

interface Props {
	tracks: RecentTrack[];
}

export function RecentTracks({ tracks }: Props) {
	// Filter out the currently playing track (shown in hero)
	const pastTracks = tracks.filter((t) => !t.nowPlaying);

	if (!pastTracks.length) return null;

	return (
		<section className="animate-fade-up">
			<div className="flex items-center gap-4 mb-6">
				<h2 className="font-display text-3xl italic text-primary font-light">
					Recent
				</h2>
				<div className="flex-1 h-px bg-linear-to-r from-edge/60 to-transparent" />
			</div>

			<div className="space-y-1">
				{pastTracks.map((track, i) => {
					const ago = track.playedAt ? timeAgo(track.playedAt) : "";

					return (
						<a
							key={`${track.name}-${track.playedAt ?? i}`}
							href={track.url}
							target="_blank"
							rel="noopener noreferrer"
							className="group flex items-center gap-3 py-2.5 px-3 -mx-3 rounded-lg transition-colors duration-200 hover:bg-card/40"
						>
							<ImageWithFallback
								src={track.imageUrl}
								alt={track.album || track.name}
								className="h-10 w-10 shrink-0 rounded"
							/>
							<div className="min-w-0 flex-1">
								<p className="text-sm text-primary truncate group-hover:text-gold transition-colors duration-200">
									{track.name}
								</p>
								<p className="text-xs text-muted truncate">
									{track.artist}
									{track.album && (
										<span className="text-edge-light">
											{" "}
											&mdash; {track.album}
										</span>
									)}
								</p>
							</div>
							{ago && (
								<span className="font-mono text-[10px] text-muted/50 shrink-0 tabular-nums tracking-wider">
									{ago}
								</span>
							)}
						</a>
					);
				})}
			</div>
		</section>
	);
}
