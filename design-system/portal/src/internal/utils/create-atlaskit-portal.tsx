import { portalClassName } from '../constants';

const isDocumentDefined = () => {
	return document !== undefined;
};

export const createAtlaskitPortal = (zIndex: number | string): HTMLDivElement | undefined => {
	//atlaskit-portal div
	if (isDocumentDefined()) {
		const atlaskitportal = document.createElement('div');
		atlaskitportal.className = portalClassName;
		atlaskitportal.style.zIndex = `${zIndex}`;
		return atlaskitportal;
	}

	return;
};
