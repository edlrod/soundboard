import type { Period } from "../types";

export function formatNumber(n: string | number): string {
	const num = typeof n === "string" ? Number.parseInt(n, 10) : n;
	if (Number.isNaN(num)) return "0";
	if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
	if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
	return num.toLocaleString();
}

export function formatDate(unixSeconds: number): string {
	const date = new Date(unixSeconds * 1000);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
	});
}

export function timeAgo(unixSeconds: number): string {
	const now = Date.now();
	const then = unixSeconds * 1000;
	const diff = now - then;

	const minutes = Math.floor(diff / 60_000);
	const hours = Math.floor(diff / 3_600_000);
	const days = Math.floor(diff / 86_400_000);

	if (minutes < 1) return "just now";
	if (minutes < 60) return `${minutes}m ago`;
	if (hours < 24) return `${hours}h ago`;
	if (days < 7) return `${days}d ago`;

	return new Date(then).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
	});
}

export const PERIOD_LABELS: Record<Period, string> = {
	"7day": "7 Days",
	"1month": "Month",
	"3month": "3 Months",
	"6month": "6 Months",
	"12month": "Year",
	overall: "All Time",
};
