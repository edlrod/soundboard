import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { SearchPage } from "./components/SearchPage";
import { envUsername, isConfigured } from "./hooks/useSoundboard";

function SetupScreen() {
	return (
		<div className="flex min-h-screen items-center justify-center px-6">
			<div className="max-w-lg text-center animate-fade-up">
				<h1 className="font-display text-5xl tracking-[0.25em] text-primary font-light mb-3">
					<span className="text-gold">S</span>OUNDBOARD
				</h1>
				<p className="text-muted text-sm mb-10">
					Music stats, beautifully rendered.
				</p>

				<div className="text-left bg-card/60 border border-edge/40 rounded-lg p-6">
					<p className="text-sm text-secondary mb-4">
						Create a{" "}
						<code className="font-mono text-gold text-xs bg-gold-dim px-1.5 py-0.5 rounded">
							.env
						</code>{" "}
						file in the project root:
					</p>
					<pre className="bg-void/80 border border-edge/30 rounded-md p-4 text-xs font-mono text-primary/80 leading-relaxed overflow-x-auto">
						<span className="text-muted/50">
							# Provider: "lastfm" (default) or "listenbrainz"
						</span>
						{"\n"}
						<span className="text-muted">VITE_API_PROVIDER</span>
						<span className="text-gold">=</span>lastfm{"\n\n"}
						<span className="text-muted/50">
							# Required for Last.fm only (not needed for ListenBrainz)
						</span>
						{"\n"}
						<span className="text-muted">VITE_LASTFM_API_KEY</span>
						<span className="text-gold">=</span>your_api_key{"\n\n"}
						<span className="text-muted/50">
							# Optional: lock to a single profile
						</span>
						{"\n"}
						<span className="text-muted/50">VITE_USERNAME</span>
						<span className="text-gold/50">=</span>
						<span className="text-muted/50">optional</span>
					</pre>
					<p className="text-xs text-muted mt-4">
						<strong className="text-secondary">Last.fm:</strong> Get an API key
						at{" "}
						<a
							href="https://www.last.fm/api/account/create"
							target="_blank"
							rel="noopener noreferrer"
							className="text-gold hover:text-gold-bright underline underline-offset-2 transition-colors"
						>
							last.fm/api
						</a>
						. <strong className="text-secondary">ListenBrainz:</strong> No API
						key needed &mdash; just set{" "}
						<code className="font-mono text-gold text-xs bg-gold-dim px-1 py-0.5 rounded">
							VITE_API_PROVIDER=listenbrainz
						</code>
						.
					</p>
					<p className="text-xs text-muted mt-2">
						Set a username to lock to a single profile, or leave it blank for
						explore mode.
					</p>
				</div>
			</div>
		</div>
	);
}

export default function App() {
	const [searchedUser, setSearchedUser] = useState<string | null>(null);

	if (!isConfigured) return <SetupScreen />;

	// Personal mode: username is set in .env
	if (envUsername) {
		return <Dashboard username={envUsername} />;
	}

	// Explore mode: search for any user
	if (searchedUser) {
		return (
			<Dashboard
				key={searchedUser}
				username={searchedUser}
				onBack={() => setSearchedUser(null)}
			/>
		);
	}

	return <SearchPage onSearch={setSearchedUser} />;
}
