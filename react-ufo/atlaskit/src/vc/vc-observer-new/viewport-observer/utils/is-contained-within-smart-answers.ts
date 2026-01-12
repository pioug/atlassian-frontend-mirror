import { getDocument } from '@atlaskit/browser-apis';

export function isContainedWithinSmartAnswers(node: HTMLElement): boolean {
	const doc = getDocument();
	if (!doc) {
		return false;
	}

	const smartAnswersElement = doc.getElementById('search-page-smart-answers');
	if (!smartAnswersElement) {
		return false;
	}

	// When the node is the smart answer element, .contains() still returns true
	return smartAnswersElement.contains(node);
}
