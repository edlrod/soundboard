import { useSoundboard } from "../hooks/useSoundboard";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ProfileHero } from "./ProfileHero";
import { RecentTracks } from "./RecentTracks";
import { TopAlbums } from "./TopAlbums";
import { TopArtists } from "./TopArtists";
import { TopTracks } from "./TopTracks";

interface Props {
	username: string;
	onBack?: () => void;
}

function LoadingScreen() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="text-center animate-fade-in">
				<h1 className="font-display text-4xl tracking-[0.3em] text-primary font-light flex justify-center">
					<span className="text-gold">S</span>OUNDBOARD
				</h1>
				<div className="mt-6 flex justify-center gap-1.5">
					{[0, 1, 2].map((i) => (
						<div
							key={i}
							className="h-1.5 w-1.5 rounded-full bg-gold"
							style={{
								animation: "pulse-glow 1.2s ease infinite",
								animationDelay: `${i * 200}ms`,
							}}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

function ErrorScreen({
	message,
	onRetry,
	onBack,
}: {
	message: string;
	onRetry: () => void;
	onBack?: () => void;
}) {
	return (
		<div className="flex min-h-screen items-center justify-center px-6">
			<div className="text-center max-w-md animate-fade-up">
				<div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-danger/10 mb-6">
					<svg
						className="h-7 w-7 text-danger"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={1.5}
						aria-label="Error"
						role="img"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
						/>
					</svg>
				</div>
				<h2 className="font-display text-2xl italic text-primary mb-2">
					Something went wrong
				</h2>
				<p className="text-sm text-muted mb-6 leading-relaxed">{message}</p>
				<div className="flex items-center justify-center gap-3">
					{onBack && (
						<button
							type="button"
							onClick={onBack}
							className="cursor-pointer rounded-md bg-card border border-edge px-5 py-2.5 text-sm font-mono text-secondary tracking-wider transition-colors hover:bg-card-hover hover:border-edge-light"
						>
							Back
						</button>
					)}
					<button
						type="button"
						onClick={onRetry}
						className="cursor-pointer rounded-md bg-card border border-edge px-5 py-2.5 text-sm font-mono text-gold tracking-wider transition-colors hover:bg-card-hover hover:border-gold/30"
					>
						Retry
					</button>
				</div>
			</div>
		</div>
	);
}

export function Dashboard({ username, onBack }: Props) {
	const { data, loading, periodLoading, error, period, setPeriod, retry } =
		useSoundboard(username);

	if (loading) return <LoadingScreen />;
	if (error)
		return <ErrorScreen message={error} onRetry={retry} onBack={onBack} />;
	if (!data.user) return null;

	return (
		<div className="min-h-screen">
			<Header
				period={period}
				setPeriod={setPeriod}
				periodLoading={periodLoading}
				onBack={onBack}
			/>

			<main className="mx-auto max-w-6xl px-6 py-12 space-y-16">
				<ProfileHero user={data.user} recentTracks={data.recentTracks} />

				<TopArtists artists={data.topArtists} loading={periodLoading} />

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
					<TopAlbums albums={data.topAlbums} loading={periodLoading} />
					<TopTracks tracks={data.topTracks} loading={periodLoading} />
				</div>

				<RecentTracks tracks={data.recentTracks} />

				<Footer />
			</main>
		</div>
	);
}
