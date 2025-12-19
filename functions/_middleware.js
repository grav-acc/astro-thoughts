// 文件路径: /functions/_middleware.js

/**
 * Cloudflare Pages Middleware
 * 用于将 pages.dev 域名自动 301 重定向到自定义域名
 */
export async function onRequest(context) {
	const url = new URL(context.request.url);

	// 1. 识别：是否通过旧的 pages.dev 域名访问？
	// 注意：这里填你想要“屏蔽”的那个 pages.dev 域名
	if (url.hostname === "astro-thoughts.pages.dev") {
		// 2. 替换：修改为你的正式自定义域名
		url.hostname = "memo.demosaic.org";

		// 3. 跳转：执行 301 永久重定向 (SEO 友好)
		// 这样所有路径（如 /about, /blog/post-1）都会自动带过去
		return Response.redirect(url.toString(), 301);
	}

	// 如果已经是自定义域名，或者本地预览，则什么都不做，继续后续逻辑
	return context.next();
}
