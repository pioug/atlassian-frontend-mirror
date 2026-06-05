import { FLEX_ITEMS_CONTAINER_BREAKPOINT_NUMBERS } from '../../constants';

export function getColumnCount(clientWidth: number): number {
	const { small, medium, large } = FLEX_ITEMS_CONTAINER_BREAKPOINT_NUMBERS;
	switch (true) {
		case clientWidth < small:
			return 1;
		case clientWidth >= small && clientWidth < medium:
			return Math.floor(clientWidth / 200);
		case clientWidth >= large:
			return Math.floor(clientWidth / 248);
		default:
			return Math.floor(clientWidth / 220);
	}
}
