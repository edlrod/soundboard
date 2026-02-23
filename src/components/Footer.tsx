import { GITHUB_URL } from "../lib/constants";
import { providerName, providerUrl } from "../lib/provider";

export function Footer() {
	return (
		<footer className="border-t border-edge/30 pt-8 pb-4">
			<div className="flex items-center justify-between text-xs text-muted/50">
				<span className="font-display italic tracking-wider">Soundboard</span>
				<div className="flex items-center gap-3 font-mono">
					<a
						href={GITHUB_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="text-muted hover:text-gold transition-colors"
					>
						GitHub
					</a>
					<span className="text-edge">·</span>
					<span>
						powered by{" "}
						<a
							href={providerUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="text-muted hover:text-gold transition-colors"
						>
							{providerName}
						</a>
					</span>
				</div>
			</div>
		</footer>
	);
}
