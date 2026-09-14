import { isInIframe } from './is-in-iframe';
import { isWithinPreviewPanel } from './is-within-preview-panel';

/**
 * Checks if a modal is being displayed within a preview panel iframe.
 * This is useful for components that need to adjust their behavior when
 * rendered inside a preview panel (e.g., hiding certain UI elements).
 * @returns true if in an iframe AND within a preview panel, false otherwise
 */
export const isWithinPreviewPanelIFrame: any = (): boolean => {
	return isInIframe() && isWithinPreviewPanel();
};
