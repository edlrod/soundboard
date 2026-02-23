import { type SubmitEvent, useState } from "react";
import { GITHUB_URL } from "../lib/constants";
import { providerName, providerUrl } from "../lib/provider";

interface Props {
	onSearch: (username: string) => void;
}

export function SearchPage({ onSearch }: Props) {
	const [value, setValue] = useState("");

	const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		const trimmed = value.trim();
		if (trimmed) onSearch(trimmed);
	};

	return (
		<div className="flex min-h-screen items-center justify-center px-6">
			<div className="w-full max-w-xl text-center animate-fade-up">
				<h1 className="font-display text-5xl sm:text-6xl tracking-[0.25em] text-primary font-light mb-3 select-none">
					<span className="text-gold">S</span>OUNDBOARD
				</h1>
				<p className="text-muted text-sm mb-12">
					Explore anyone's listening history.
				</p>

				<form onSubmit={handleSubmit} className="relative">
					<input
						type="text"
						value={value}
						onChange={(e) => setValue(e.target.value)}
						placeholder={`enter a ${providerName} username`}
						className="
							w-full bg-card/60 border border-edge/50 rounded-lg
							px-5 py-4 text-sm font-mono text-primary
							placeholder:text-muted/40
							outline-none
							transition-all duration-300
							focus:border-gold/40 focus:shadow-[0_0_20px_rgba(200,164,78,0.06)]
						"
					/>
					<button
						type="submit"
						disabled={!value.trim()}
						className="
							absolute right-3 top-1/2 -translate-y-1/2
							text-muted hover:text-gold transition-colors cursor-pointer
							disabled:opacity-30 disabled:cursor-default
						"
						aria-label="Search"
					>
						<svg
							className="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={1.5}
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
							/>
						</svg>
					</button>
				</form>

				<div className="mt-12 flex items-center justify-center gap-3 text-[11px] font-mono text-muted/40">
					<a
						href={GITHUB_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-muted transition-colors"
					>
						GitHub
					</a>
					<span className="text-edge/40">·</span>
					<span>
						powered by{" "}
						<a
							href={providerUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-muted transition-colors"
						>
							{providerName}
						</a>
					</span>
				</div>
			</div>
		</div>
	);
}
