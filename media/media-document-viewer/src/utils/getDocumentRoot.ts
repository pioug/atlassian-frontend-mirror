export const DOCUMENT_SCROLL_ROOT_ID = 'document-scroll-root';

export const getDocumentRoot = (): HTMLElement | Document | undefined => {
	if (typeof window === 'undefined') {
		return;
	}

	if (typeof window.document === 'undefined') {
		return;
	}

	const root = document.getElementById(DOCUMENT_SCROLL_ROOT_ID);
	if (root) {
		return root;
	}

	return window.document;
};
