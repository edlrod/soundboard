import { PERIOD_LABELS } from "../lib/utils";
import type { Period } from "../types";

const PERIODS: Period[] = [
	"7day",
	"1month",
	"3month",
	"6month",
	"12month",
	"overall",
];

interface Props {
	period: Period;
	setPeriod: (p: Period) => void;
	periodLoading: boolean;
	onBack?: () => void;
}

export function Header({ period, setPeriod, periodLoading, onBack }: Props) {
	return (
		<header className="sticky top-0 z-50 border-b border-edge/50 bg-void/80 backdrop-blur-xl">
			<div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
				<div className="flex items-center gap-3">
					{onBack && (
						<button
							type="button"
							onClick={onBack}
							className="cursor-pointer text-muted hover:text-gold transition-colors mr-1"
							aria-label="Back to search"
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
									d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
								/>
							</svg>
						</button>
					)}
					<h1 className="font-display text-2xl tracking-[0.25em] text-primary font-light select-none">
						<span className="text-gold">S</span>OUNDBOARD
					</h1>
				</div>

				<div
					className="flex items-center gap-1"
					role="tablist"
					aria-label="Time period"
				>
					{PERIODS.map((p) => (
						<button
							key={p}
							type="button"
							role="tab"
							aria-selected={period === p}
							onClick={() => setPeriod(p)}
							disabled={periodLoading}
							className={`
								relative px-3 py-1.5 text-xs font-mono tracking-wider rounded-sm
								transition-all duration-200 cursor-pointer
								${
									period === p
										? "text-gold bg-gold-dim"
										: "text-muted hover:text-secondary hover:bg-card"
								}
								${periodLoading ? "opacity-50 pointer-events-none" : ""}
							`}
						>
							{PERIOD_LABELS[p]}
							{period === p && (
								<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-px bg-gold" />
							)}
						</button>
					))}
				</div>
			</div>
		</header>
	);
}
