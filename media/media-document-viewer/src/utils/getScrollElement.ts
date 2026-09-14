import { getDocument } from '@atlaskit/browser-apis';

import { DOCUMENT_SCROLL_ROOT_ID } from './constants';

export const getScrollElement = (): HTMLElement | null => {
	const element = getDocument();
	return element && element.getElementById(DOCUMENT_SCROLL_ROOT_ID);
};
