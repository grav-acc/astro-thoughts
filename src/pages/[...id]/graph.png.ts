import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import config, { monolocale } from "$config";
import graph from "$graph/content";

export async function getStaticPaths() {
	// 1. 同时获取 jotting 和 note
	const jottings = await getCollection("jotting", item => !item.data.draft);
	const notes = await getCollection("note", item => !item.data.draft);

	// 辅助函数：生成路径参数
	const generateParams = (item: any, type: "jotting" | "note") => {
		let locale: string | undefined;
		let id: string;

		if (monolocale) {
			locale = undefined;
			id = item.id;
		} else {
			const [language, ...ids] = item.id.split("/");
			const slug = ids.join("/");

			locale = config.i18n.defaultLocale === language ? undefined : language;

			// 关键修复：确保 ID 包含语言前缀 (例如 "en/about")，否则 URL 会变成 "/about" 导致冲突或 404
			id = locale ? `${locale}/${slug}` : slug;
		}

		return {
			params: { id }, // 路由参数：必须是完整的 URL 片段
			props: {
				locale: locale || config.i18n.defaultLocale, // 显式传递 locale，不要依赖 params
				type,
				title: item.data.title,
				timestamp: item.data.timestamp,
				tags: item.data.tags,
				series: type === "note" ? item.data.series : undefined
			}
		};
	};

	// 2. 合并两个集合的路径
	const jottingPaths = jottings.map(item => generateParams(item, "jotting"));
	const notePaths = notes.map(item => generateParams(item, "note"));

	return [...jottingPaths, ...notePaths];
}

/**
 * GET handler
 */
export const GET: APIRoute = async ({ props }) => {
	// 从 props 获取 locale，因为 params.locale 在 [...id] 路由中是拿不到的
	const image = await graph({
		locale: props.locale,
		type: props.type,
		site: config.title,
		author: config.author.name,
		title: props.title,
		timestamp: props.timestamp,
		tags: props.tags,
		series: props.series
	});

	return new Response(new Uint8Array(image), { headers: { "Content-Type": "image/png" } });
};
