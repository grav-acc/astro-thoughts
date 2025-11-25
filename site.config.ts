import siteConfig from "./src/utils/config";

const config = siteConfig({
	title: "Thoughts.Mosaic",
	prologue: "Every piece of thoughts\nbegins as a mosaic.",
	author: {
		name: "Bard",
		email: "contact@demosaic.org",
		link: "https://demosaic.org"
	},
	description: "Every piece of thoughts begins as a mosaic.",
	copyright: {
		type: "CC BY-NC-ND 4.0",
		year: "2025"
	},
	i18n: {
		locales: ["en", "zh-cn"],
		defaultLocale: "en"
	},
	feed: {
		section: "*",
		limit: 20
	},
	latest: "*"
});

export const monolocale = Number(config.i18n.locales.length) === 1;

export default config;
