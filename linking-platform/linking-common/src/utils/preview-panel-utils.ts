/**
 * Utility functions for detecting iframe and preview panel contexts.
 * These utilities help components determine if they're running inside an iframe
 * or within a preview panel context.
 */

type PreviewPanelIndicators = {
	CONFLUENCE_PAGE_PREVIEW: string;
	EMBEDDED_SOURCE: string;
	PREVIEW_PANELS: string;
};

const PREVIEW_PANEL_INDICATORS: PreviewPanelIndicators = {
	EMBEDDED_SOURCE: 'embeddedConfluenceSource',
	PREVIEW_PANELS: 'previewPanels',
	CONFLUENCE_PAGE_PREVIEW: 'confluence-page-preview-panel',
};

const getUrlSearchParams = (url: string): URLSearchParams | null => {
	try {
		return new URLSearchParams(url);
	} catch {
		return null;
	}
};

const hasPreviewPanelIndicators = (searchParams: URLSearchParams): boolean => {
	return (
		searchParams.has(PREVIEW_PANEL_INDICATORS.PREVIEW_PANELS) ||
		searchParams.get(PREVIEW_PANEL_INDICATORS.EMBEDDED_SOURCE) ===
			PREVIEW_PANEL_INDICATORS.CONFLUENCE_PAGE_PREVIEW
	);
};

/**
 * Checks if the current code is running inside an iframe.
 * @returns true if running in an iframe, false otherwise
 */
export const isInIframe = (): boolean => {
	try {
		return window !== window.top;
	} catch {
		// If we can't access window.top due to cross-origin restrictions, assume we're in an iframe
		return true;
	}
};

/**
 * Checks if the current context is within a preview panel.
 * This is determined by checking for specific URL parameters:
 * - previewPanels parameter
 * - embeddedConfluenceSource=confluence-page-preview-panel
 */
export const isWithinPreviewPanel = (): boolean => {
	try {
		const currentSearch = window.location.search;
		if (currentSearch) {
			const currentParams = getUrlSearchParams(currentSearch);
			if (currentParams && hasPreviewPanelIndicators(currentParams)) {
				return true;
			}
		}
		return false;
	} catch {
		return false;
	}
};

/**
 * Checks if a modal is being displayed within a preview panel iframe.
 * This is useful for components that need to adjust their behavior when
 * rendered inside a preview panel (e.g., hiding certain UI elements).
 * @returns true if in an iframe AND within a preview panel, false otherwise
 */
export const isWithinPreviewPanelIFrame = (): boolean => {
	return isInIframe() && isWithinPreviewPanel();
};
