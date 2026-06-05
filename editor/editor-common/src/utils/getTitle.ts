import commonMessages from '../messages';
import type { BreakoutMode } from '../types/breakout';

export const getTitle = (
	layout?: BreakoutMode,
): {
	id: string;
	defaultMessage: string;
	description: string;
} => {
	switch (layout) {
		case 'full-width':
			return commonMessages.layoutFixedWidth;
		case 'wide':
			return commonMessages.layoutFullWidth;
		default:
			return commonMessages.layoutWide;
	}
};
