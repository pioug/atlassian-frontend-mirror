import { portalParentClassName, portalParentSelector } from '../constants';

import { getBody } from './get-body';

const isDocumentDefined = () => {
	return document !== undefined;
};

export const createPortalParent = (): Element | undefined => {
	//atlaskit-portal-container div
	if (isDocumentDefined()) {
		const parentElement = document.querySelector(portalParentSelector);
		if (!parentElement) {
			const parent = document.createElement('div');
			parent.className = portalParentClassName;
			parent.style.display = 'flex';
			getBody()?.appendChild(parent);
			return parent;
		}
		return parentElement;
	}

	return;
};
