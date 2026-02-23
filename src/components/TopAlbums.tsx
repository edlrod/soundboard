import { formatNumber } from "../lib/utils";
import type { TopAlbum } from "../types";
import { ImageWithFallback } from "./ImageWithFallback";

interface Props {
	albums: TopAlbum[];
	loading: boolean;
}

function AlbumCard({ album, rank }: { album: TopAlbum; rank: number }) {
	return (
		<a
			href={album.url}
			target="_blank"
			rel="noopener noreferrer"
			className="group block"
		>
			<div className="relative overflow-hidden rounded-md bg-card border border-edge/20 transition-all duration-300 group-hover:border-gold/20 group-hover:shadow-[0_4px_20px_rgba(200,164,78,0.06)]">
				<ImageWithFallback
					src={album.imageUrl}
					alt={album.name}
					fallbackLetter={album.name.charAt(0)}
					className="aspect-square w-full transition-transform duration-500 group-hover:scale-105"
				/>
				<div className="absolute inset-0 bg-linear-to-t from-void/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
				<span className="absolute top-2 left-2 font-mono text-sm text-gold/40 font-light">
					{String(rank).padStart(2, "0")}
				</span>
			</div>
			<div className="mt-2.5 px-0.5">
				<h3 className="text-sm font-medium text-primary truncate group-hover:text-gold transition-colors duration-200">
					{album.name}
				</h3>
				<p className="text-xs text-muted truncate mt-0.5">{album.artist}</p>
				<p className="font-mono text-[10px] text-muted/60 mt-1 tracking-wider">
					{formatNumber(album.playcount)} plays
				</p>
			</div>
		</a>
	);
}

export function TopAlbums({ albums, loading }: Props) {
	if (loading) {
		return (
			<section>
				<SectionHeading />
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
					{Array.from({ length: 8 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
						<div key={i}>
							<div className="skeleton aspect-square rounded-md" />
							<div className="skeleton mt-2 h-4 w-3/4 rounded" />
							<div className="skeleton mt-1 h-3 w-1/2 rounded" />
						</div>
					))}
				</div>
			</section>
		);
	}

	if (!albums.length) return null;

	return (
		<section className="animate-fade-up">
			<SectionHeading />
			<div className="stagger grid grid-cols-2 sm:grid-cols-4 gap-4">
				{albums.map((album, i) => (
					<AlbumCard
						key={`${album.name}-${album.artist}`}
						album={album}
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
				Top Albums
			</h2>
			<div className="flex-1 h-px bg-linear-to-r from-edge/60 to-transparent" />
		</div>
	);
}
