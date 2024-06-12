import { CREATE_BREAKPOINT } from './constants';

export const actionSectionDesktopCSS = {
	[`@media (max-width: ${CREATE_BREAKPOINT - 1}px)`]: {
		display: 'none !important',
	},
};

export const actionSectionMobileCSS = {
	[`@media (min-width: ${CREATE_BREAKPOINT}px)`]: {
		display: 'none !important',
	},
};
