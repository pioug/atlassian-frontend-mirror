import { LEFT_PANEL_WIDTH } from './constants';

export const getLeftPanelWidth = (): number => {
	if (typeof window === 'undefined') {
		return 0;
	}

	return (
		parseInt(
			window.getComputedStyle(document.documentElement).getPropertyValue(`--${LEFT_PANEL_WIDTH}`),
			10,
		) || 0
	);
};
