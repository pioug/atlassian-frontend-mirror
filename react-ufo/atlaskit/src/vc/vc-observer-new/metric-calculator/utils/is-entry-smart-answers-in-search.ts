import { getDocument } from '@atlaskit/browser-apis';

import type { VCObserverEntry, ViewportEntryData } from '../../types';

export function isEntrySmartAnswersInSearch(entry: VCObserverEntry): boolean {
	const { elementName } = entry.data as ViewportEntryData;
	if (!elementName || elementName === 'START') {
		return false;
	}

	const doc = getDocument();
	if (!doc) {
		return false;
	}

	const smartAnswersElement = doc.getElementById('search-page-smart-answers');
	if (!smartAnswersElement) {
		return false;
	}

	const entryDOMElement = doc.querySelector(elementName);
	if (!entryDOMElement) {
		return false;
	}

	return smartAnswersElement.contains(entryDOMElement);
}
