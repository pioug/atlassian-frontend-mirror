import { getBody } from './get-body';

const isDocumentDefined = () => {
	return document !== undefined;
};

export const removePortalParent = (parentElement: Element): void => {
	if (isDocumentDefined()) {
		if (parentElement) {
			getBody()?.removeChild(parentElement);
		}
	}
};
