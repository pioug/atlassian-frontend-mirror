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
 * Checks if the current context is within a preview panel.
 * This is determined by checking for specific URL parameters:
 * - previewPanels parameter
 * - embeddedConfluenceSource=confluence-page-preview-panel
 */
export const isWithinPreviewPanel: any = (): boolean => {
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
