import { DEFAULT_LEFT_SIDEBAR_WIDTH } from './constants';

export const getLeftSidebarPercentage = (currentWidth: number, maxWidth: number): number => {
	const total =
		(currentWidth - DEFAULT_LEFT_SIDEBAR_WIDTH) / (maxWidth - DEFAULT_LEFT_SIDEBAR_WIDTH);

	if (total < 0) {
		return 0;
	}
	if (total > 1) {
		return 100;
	}

	return Math.floor(total * 100);
};
