const DEEZER_BASE = "https://api.deezer.com";

// Restrict to your deployment origin. Set to "*" to allow any origin.
const ALLOWED_ORIGIN = "https://edlrod.github.io";

const CORS_HEADERS: Record<string, string> = {
	"Access-Control-Allow-Origin": ALLOWED_ORIGIN,
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type",
};

// Only allow Deezer search endpoints
const ALLOWED_PATHS = ["/search/artist"];

function isAllowedPath(pathname: string): boolean {
	return ALLOWED_PATHS.some((p) => pathname.startsWith(p));
}

export default {
	async fetch(request: Request): Promise<Response> {
		if (request.method === "OPTIONS") {
			return new Response(null, { status: 204, headers: CORS_HEADERS });
		}

		if (request.method !== "GET") {
			return new Response("Method not allowed", {
				status: 405,
				headers: CORS_HEADERS,
			});
		}

		const url = new URL(request.url);

		if (!isAllowedPath(url.pathname)) {
			return new Response("Forbidden", {
				status: 403,
				headers: CORS_HEADERS,
			});
		}

		const deezerUrl = `${DEEZER_BASE}${url.pathname}${url.search}`;

		try {
			const res = await fetch(deezerUrl, {
				headers: { "User-Agent": "Soundboard/1.0" },
			});

			const body = await res.arrayBuffer();

			return new Response(body, {
				status: res.status,
				headers: {
					"Content-Type": res.headers.get("Content-Type") ?? "application/json",
					"Cache-Control": "public, max-age=86400",
					...CORS_HEADERS,
				},
			});
		} catch {
			return new Response(
				JSON.stringify({ error: "Upstream request failed" }),
				{
					status: 502,
					headers: {
						"Content-Type": "application/json",
						...CORS_HEADERS,
					},
				},
			);
		}
	},
};
