import { formatNumber } from "../lib/utils";
import type { TopTrack } from "../types";

interface Props {
	tracks: TopTrack[];
	loading: boolean;
}

function TrackRow({ track, rank }: { track: TopTrack; rank: number }) {
	return (
		<a
			href={track.url}
			target="_blank"
			rel="noopener noreferrer"
			className="group flex items-center gap-4 py-3 px-4 -mx-4 rounded-lg transition-colors duration-200 hover:bg-card/60"
		>
			{/* Rank */}
			<span className="font-mono text-lg text-muted/50 font-light w-8 text-right shrink-0 tabular-nums group-hover:text-gold/60 transition-colors">
				{String(rank).padStart(2, "0")}
			</span>

			{/* Track info */}
			<div className="min-w-0 flex-1">
				<p className="text-sm font-medium text-primary truncate group-hover:text-gold transition-colors duration-200">
					{track.name}
				</p>
				<p className="text-xs text-muted truncate mt-0.5">{track.artist}</p>
			</div>

			{/* Play count */}
			<span className="font-mono text-xs text-muted tabular-nums shrink-0 tracking-wider">
				{formatNumber(track.playcount)}
			</span>
		</a>
	);
}

export function TopTracks({ tracks, loading }: Props) {
	if (loading) {
		return (
			<section>
				<SectionHeading />
				<div className="space-y-2">
					{Array.from({ length: 10 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
						<div key={i} className="flex items-center gap-4 py-3">
							<div className="skeleton h-5 w-8 rounded" />
							<div className="flex-1">
								<div className="skeleton h-4 w-2/3 rounded" />
								<div className="skeleton mt-1 h-3 w-1/3 rounded" />
							</div>
							<div className="skeleton h-3 w-12 rounded" />
						</div>
					))}
				</div>
			</section>
		);
	}

	if (!tracks.length) return null;

	return (
		<section className="animate-fade-up">
			<SectionHeading />
			<div className="divide-y divide-edge/20">
				{tracks.map((track, i) => (
					<TrackRow
						key={`${track.name}-${track.artist}`}
						track={track}
						rank={i + 1}
					/>
				))}
			</div>
		</section>
	);
}

function SectionHeading() {
	return (
		<div className="flex items-center gap-4 mb-6">
			<h2 className="font-display text-3xl italic text-primary font-light">
				Top Tracks
			</h2>
			<div className="flex-1 h-px bg-linear-to-r from-edge/60 to-transparent" />
		</div>
	);
}
