// @ts-check
import { defineConfig } from "astro/config";
import yaml from "@rollup/plugin-yaml";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import UnoCSS from "unocss/astro";
import swup from "@swup/astro";
import icon from "astro-icon";
import githubLight from "shiki/themes/github-light.mjs";

import GFM from "remark-gfm";
import ins from "remark-ins";
import mark from "remark-flexible-markers";
import CJK from "remark-cjk-friendly";
import CJKStrikethrough from "remark-cjk-friendly-gfm-strikethrough";
import math from "remark-math";
import gemoji from "remark-gemoji";
import footnote from "remark-footnotes-extra";
import { remarkExtendedTable as table, extendedTableHandlers as tableHandler } from "remark-extended-table";
import directive from "remark-directive";
import ruby from "remark-ruby-directive";
import alerts from "remark-github-blockquote-alert";
import { rehypeHeadingIds as ids } from "@astrojs/markdown-remark";
import anchor from "rehype-autolink-headings";
import links from "rehype-external-links";
import katex from "rehype-katex";
import sectionize from "@hbsnow/rehype-sectionize";

import spoiler from "./src/utils/remark/spoiler";
import attr from "./src/utils/remark/attr";
import abbr from "./src/utils/remark/abbr";
import wrapper from "./src/utils/remark/table-wrapper";
import copy from "./src/utils/code-copy";
import reading from "./src/utils/remark/reading";
import figure from "./src/utils/remark/figure";

import siteConfig from "./site.config";

// https://astro.build/config
export default defineConfig({
	compressHTML: false,
	site: "https://thomosaic.com",
	trailingSlash: "never",
	build: {
		format: "file"
	},
	i18n: {
		...siteConfig.i18n,
		routing: {
			redirectToDefaultLocale: false,
			prefixDefaultLocale: false
		}
	},
	markdown: {
		remarkPlugins: [
			[GFM, { singleTilde: false }],
			ins,
			mark,
			spoiler,
			attr,
			CJK,
			[CJKStrikethrough, { singleTilde: false }],
			math,
			gemoji,
			footnote,
			abbr,
			[table, { colspanWithEmpty: true }],
			wrapper,
			directive,
			ruby,
			[alerts, { legacyTitle: true }],
			reading
		],
		remarkRehype: {
			footnoteLabel: null,
			footnoteLabelTagName: "p",
			footnoteLabelProperties: {
				className: ["hidden"]
			},
			handlers: {
				...tableHandler
			}
		},
		rehypePlugins: [
			ids,
			[anchor, { behavior: "wrap" }],
			[links, { target: "_blank", rel: ["nofollow", "noopener", "noreferrer"] }],
			katex,
			figure,
			sectionize
		],
		smartypants: false,
		shikiConfig: {
			themes: {
				light: {
					...githubLight,
					colorReplacements: {
						"#fff": "var(--block-color)"
					}
				},
				dark: "dark-plus"
			},
			transformers: [
				copy({
					duration: 1500
				})
			]
		}
	},
	vite: {
		optimizeDeps: {
			// Workaround for https://github.com/withastro/astro/issues/14692
			include: ["picocolors"]
		},
		// @ts-expect-error
		plugins: [yaml()]
	},
	integrations: [
		svelte(),
		mdx(),
		sitemap({
			// 在这里对进入 sitemap 的 URL 进行最终“整容”
			serialize(item) {
				// 移除 .html
				item.url = item.url.replace(/\.html$/, "");

				// 严格要求无尾斜杠，也可以移除末尾斜杠
				// 根路径不能变空
				if (item.url.endsWith("/") && item.url !== "https://thomosaic.com/") {
					item.url = item.url.slice(0, -1);
				}

				return item;
			}
		}),
		swup({
			globalInstance: true,
			preload: false,
			smoothScrolling: false,
			progress: true
		}),
		UnoCSS({
			injectReset: "@unocss/reset/normalize.css"
		}),
		icon()
	]
});
