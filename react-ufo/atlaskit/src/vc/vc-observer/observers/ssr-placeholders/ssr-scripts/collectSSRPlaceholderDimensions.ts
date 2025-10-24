import { fg } from '@atlaskit/platform-feature-flags';

// lightweight script to scan the SSR response and collect all elements with data-ssr-placeholder attribute
// and save their size/positions in a map __SSR_PLACEHOLDERS_DIMENSIONS__ on the Window object. Each placeholderId is
// unique and maps to its corresponding elements bounding client rectangle dimensions.
export function collectSSRPlaceholderDimensions(
	document: Document,
	window: Window,
	enablePageLayoutPlaceholder: boolean = false,
) {
	const enableDisplayContentsSupport = fg('platform_ufo_ssr_placeholders_for_display_contents');

	const ssrPlaceholders = document?.querySelectorAll('[data-ssr-placeholder]');
	ssrPlaceholders.forEach((elem: Element) => {
		const placeholderId = elem.getAttribute('data-ssr-placeholder');
		if (placeholderId) {
			window.__SSR_PLACEHOLDERS_DIMENSIONS__ = window.__SSR_PLACEHOLDERS_DIMENSIONS__ || {};
			if (enableDisplayContentsSupport) {
				window.__SSR_PLACEHOLDERS_DIMENSIONS__[placeholderId] = getEffectiveBoundingRect(
					elem,
					window,
				);
			} else {
				window.__SSR_PLACEHOLDERS_DIMENSIONS__[placeholderId] = elem.getBoundingClientRect();
			}
		}
	});
	if (enablePageLayoutPlaceholder) {
		const pageLayoutRoot = document?.getElementById('unsafe-design-system-page-layout-root');
		if (pageLayoutRoot) {
			window.__SSR_PLACEHOLDERS_DIMENSIONS__ = window.__SSR_PLACEHOLDERS_DIMENSIONS__ || {};
			if (enableDisplayContentsSupport) {
				window.__SSR_PLACEHOLDERS_DIMENSIONS__['page-layout.root'] = getEffectiveBoundingRect(
					pageLayoutRoot,
					window,
				);
			} else {
				window.__SSR_PLACEHOLDERS_DIMENSIONS__['page-layout.root'] =
					pageLayoutRoot.getBoundingClientRect();
			}
		}
	}
}

/**
 * Gets the effective bounding rectangle for an element, handling display: contents elements
 * by collecting dimensions from their children instead
 */
function getEffectiveBoundingRect(elem: Element, window: Window): DOMRect {
	const computedStyle = window.getComputedStyle(elem);

	// If element has display: contents, collect bounding rect from children
	if (computedStyle.display === 'contents') {
		const children = Array.from(elem.children);
		if (children.length === 0) {
			// No children, return zero rect
			return new DOMRect(0, 0, 0, 0);
		}

		// Calculate union of all children's bounding rects
		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;

		children.forEach((child) => {
			const childRect = child.getBoundingClientRect();
			// Skip children with zero dimensions (likely also display: contents)
			if (childRect.width > 0 || childRect.height > 0) {
				minX = Math.min(minX, childRect.left);
				minY = Math.min(minY, childRect.top);
				maxX = Math.max(maxX, childRect.right);
				maxY = Math.max(maxY, childRect.bottom);
			}
		});

		// If no children with dimensions found, return zero rect
		if (minX === Infinity) {
			return new DOMRect(0, 0, 0, 0);
		}

		return new DOMRect(minX, minY, maxX - minX, maxY - minY);
	}

	// Normal element, return its bounding rect
	return elem.getBoundingClientRect();
}
