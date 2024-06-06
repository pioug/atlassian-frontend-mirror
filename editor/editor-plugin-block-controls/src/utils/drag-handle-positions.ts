import { DRAG_HANDLE_WIDTH, dragHandleGap } from '../ui/consts';

export const getTopPosition = (dom: HTMLElement) => {
	const table = dom.querySelector('table');
	if (table) {
		return `${dom.offsetTop + (table?.offsetTop || 0)}px`;
	} else {
		return `${dom.offsetTop}px`;
	}
};

export const getLeftPosition = (dom: HTMLElement, type: string) => {
	const resizer: HTMLElement | null = ['table', 'mediaSingle'].includes(type)
		? dom.querySelector('.resizer-item')
		: null;
	let left = `${dom.offsetLeft - dragHandleGap(type) - DRAG_HANDLE_WIDTH}px`;
	if (resizer) {
		left =
			getComputedStyle(resizer).transform === 'none'
				? `${resizer.offsetLeft - dragHandleGap(type) - DRAG_HANDLE_WIDTH}px`
				: `${resizer.offsetLeft - resizer.offsetWidth / 2 - dragHandleGap(type) - DRAG_HANDLE_WIDTH}px`;
	}

	return left;
};
