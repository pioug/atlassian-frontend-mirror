import { getDocument } from '@atlaskit/browser-apis';

export const DOCUMENT_SCROLL_ROOT_ID = 'document-scroll-root';

export const getDocumentRoot = (): HTMLElement | Document | undefined => {
	const doc = getDocument();
	if (!doc) {
		return;
	}

	const root = doc.getElementById(DOCUMENT_SCROLL_ROOT_ID) as HTMLElement;
	if (root) {
		return root;
	}

	return doc;
};

export const getScrollElement = (): HTMLElement | null => {
	const element = getDocument();
	return element && element.getElementById(DOCUMENT_SCROLL_ROOT_ID);
};
