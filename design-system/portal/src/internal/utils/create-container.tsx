import { portalClassName } from '../constants';

export const createContainer = (zIndex: number | string): HTMLDivElement => {
	const container = document.createElement('div');
	container.className = portalClassName;
	container.style.zIndex = `${zIndex}`;
	return container;
};
