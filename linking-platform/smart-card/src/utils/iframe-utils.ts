import type { EmbedModalProps } from '../view/EmbedModal/types';

export const isInIframe = (): boolean => {
	try {
		return window !== window.top;
	} catch {
		// If we can't access window.top due to cross-origin restrictions, assume we're in an iframe
		return true;
	}
};

export const isWithinPreviewPanel = (): boolean => {
	try {
		const params = new URLSearchParams(window.location.search);
		return (
			params.has('previewPanels') ||
			params.get('embeddedConfluenceSource') === 'confluence-page-preview-panel'
		);
	} catch {
		return false;
	}
};

export const isModalWithinPreviewPanelIFrame = (): boolean => {
	return isInIframe() && isWithinPreviewPanel();
};

// Signals parent product to open embed modal via postMessage when in iframe context
export const openEmbedModalInParent = (modalProps: Partial<EmbedModalProps>) => {
	if (!isInIframe()) {
		return;
	}

	window.parent.postMessage(
		{
			type: 'OPEN_EMBED_MODAL',
			payload: {
				modal: {
					url: modalProps?.url || '',
				},
			},
		},
		'*',
	);
};
