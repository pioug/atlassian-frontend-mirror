import { closest } from './dom';

export const isElementInTableCell = (element: HTMLElement | null): HTMLElement | null => {
	return closest(element, 'td, th');
};
