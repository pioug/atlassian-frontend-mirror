// lightweight script to scan the SSR response and collect all elements with data-ssr-placeholder attribute
// and save their size/positions in a map __SSR_PLACEHOLDERS_DIMENSIONS__ on the Window object. Each placeholderId is
// unique and maps to its corresponding elements bounding client rectangle dimensions.
export function collectSSRPlaceholderDimensions(
	document: Document,
	window: Window,
	enablePageLayoutPlaceholder: boolean = false,
) {
	const ssrPlaceholders = document?.querySelectorAll('[data-ssr-placeholder]');
	ssrPlaceholders.forEach((elem: Element) => {
		const placeholderId = elem.getAttribute('data-ssr-placeholder');
		const boundingClient = elem.getBoundingClientRect();
		if (placeholderId) {
			window.__SSR_PLACEHOLDERS_DIMENSIONS__ = window.__SSR_PLACEHOLDERS_DIMENSIONS__ || {};
			window.__SSR_PLACEHOLDERS_DIMENSIONS__[placeholderId] = boundingClient;
		}
	});
	if (enablePageLayoutPlaceholder) {
		const pageLayoutRoot = document?.getElementById('unsafe-design-system-page-layout-root');
		if (pageLayoutRoot) {
			const boundingClient = pageLayoutRoot.getBoundingClientRect();
			window.__SSR_PLACEHOLDERS_DIMENSIONS__ = window.__SSR_PLACEHOLDERS_DIMENSIONS__ || {};
			window.__SSR_PLACEHOLDERS_DIMENSIONS__['page-layout.root'] = boundingClient;
		}
	}
}
