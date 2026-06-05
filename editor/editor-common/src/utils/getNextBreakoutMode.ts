import type { BreakoutMode } from '../types/breakout';

export const getNextBreakoutMode = (currentMode?: BreakoutMode): Exclude<BreakoutMode, 'max'> => {
	if (currentMode === 'full-width') {
		return 'center';
	} else if (currentMode === 'wide') {
		return 'full-width';
	}

	return 'wide';
};
