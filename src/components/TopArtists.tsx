import { useArtistImage } from "../hooks/useArtistImage";
import { formatNumber } from "../lib/utils";
import type { TopArtist } from "../types";
import { ImageWithFallback } from "./ImageWithFallback";

interface Props {
	artists: TopArtist[];
	loading: boolean;
}

function ArtistCard({
	artist,
	rank,
	featured,
}: {
	artist: TopArtist;
	rank: number;
	featured?: boolean;
}) {
	const { data: image } = useArtistImage(artist.name);

	return (
		<a
			href={artist.url}
			target="_blank"
			rel="noopener noreferrer"
			className={`
				group relative overflow-hidden rounded-lg bg-card border border-edge/30
				transition-all duration-300 ease-out
				hover:border-gold/30 hover:shadow-[0_8px_32px_rgba(200,164,78,0.08)]
				hover:-translate-y-1
				${featured ? "col-span-2 row-span-2" : ""}
			`}
		>
			<div className="relative aspect-square">
				<ImageWithFallback
					src={image ?? null}
					alt={artist.name}
					fallbackLetter={artist.name.charAt(0)}
					className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105"
				/>
				{/* Gradient overlay */}
				<div className="absolute inset-0 bg-linear-to-t from-void/90 via-void/30 to-transparent" />

				{/* Rank badge */}
				<span
					className={`
						absolute top-3 left-3 font-mono text-gold/60 font-light
						${featured ? "text-6xl" : "text-2xl"}
					`}
				>
					{String(rank).padStart(2, "0")}
				</span>

				{/* Info at bottom */}
				<div className="absolute bottom-0 left-0 right-0 p-4">
					<h3
						className={`
							font-display font-medium text-primary leading-tight
							${featured ? "text-2xl sm:text-3xl" : "text-base"}
						`}
					>
						{artist.name}
					</h3>
					<p className="font-mono text-xs text-muted mt-1 tracking-wider">
						{formatNumber(artist.playcount)} plays
					</p>
				</div>
			</div>
		</a>
	);
}

export function TopArtists({ artists, loading }: Props) {
	if (loading) {
		return (
			<section>
				<SectionHeading />
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
					{Array.from({ length: 8 }).map((_, i) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
							key={i}
							className={`skeleton aspect-square rounded-lg ${i === 0 ? "col-span-2 row-span-2" : ""}`}
						/>
					))}
				</div>
			</section>
		);
	}

	if (!artists.length) return null;

	return (
		<section className="animate-fade-up">
			<SectionHeading />
			<div className="stagger grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
				{artists.map((artist, i) => (
					<ArtistCard
						key={artist.name}
						artist={artist}
						rank={i + 1}
						featured={i === 0}
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
				Top Artists
			</h2>
			<div className="flex-1 h-px bg-linear-to-r from-edge/60 to-transparent" />
		</div>
	);
}
