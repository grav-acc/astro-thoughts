import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
	const text = `User-agent: *
Allow: /

Sitemap: ${new URL("sitemap-index.xml", site)}
`;

	return new Response(text);
};
