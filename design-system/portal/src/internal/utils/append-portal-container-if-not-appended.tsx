import { portalParentClassName, portalParentSelector } from '../constants';

import { getBody } from './get-body';

const getPortalParent = (): Element => {
	const parentElement = document.querySelector(portalParentSelector);
	if (!parentElement) {
		const parent = document.createElement('div');
		parent.className = portalParentClassName;
		// we are setting display to flex because we want each portal to create a new stacking context
		// See https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context
		parent.style.display = 'flex';
		getBody()?.appendChild(parent);
		return parent;
	}
	return parentElement;
};

export const appendPortalContainerIfNotAppended = (container: HTMLDivElement): void => {
	if (!container.parentElement) {
		getPortalParent().appendChild(container);
	}
};
