import { useState } from "react";

interface Props {
	src: string | null;
	alt: string;
	fallbackLetter?: string;
	className?: string;
	round?: boolean;
}

export function ImageWithFallback({
	src,
	alt,
	fallbackLetter,
	className = "",
	round = false,
}: Props) {
	const [failed, setFailed] = useState(false);
	const letter = fallbackLetter ?? alt.charAt(0).toUpperCase();
	const shape = round ? "rounded-full" : "rounded-md";

	if (!src || failed) {
		return (
			<div
				className={`${shape} bg-linear-to-br from-card via-edge to-card flex items-center justify-center ${className}`}
				role="img"
				aria-label={alt}
			>
				<span className="font-display text-muted text-3xl italic select-none">
					{letter}
				</span>
			</div>
		);
	}

	return (
		<img
			src={src}
			alt={alt}
			loading="lazy"
			onError={() => setFailed(true)}
			className={`${shape} object-cover ${className}`}
		/>
	);
}
