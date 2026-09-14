import { getDocument } from '@atlaskit/browser-apis';

import { DOCUMENT_SCROLL_ROOT_ID } from './constants';

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
