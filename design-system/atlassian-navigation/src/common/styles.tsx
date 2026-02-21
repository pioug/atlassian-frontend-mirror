import { CREATE_BREAKPOINT } from './constants';

export const actionSectionDesktopCSS: {
	'@media (max-width: 1129px)': {
		display: string;
	};
} = {
	[`@media (max-width: ${CREATE_BREAKPOINT - 1}px)`]: {
		display: 'none !important',
	},
};

export const actionSectionMobileCSS: {
	'@media (min-width: 1130px)': {
		display: string;
	};
} = {
	[`@media (min-width: ${CREATE_BREAKPOINT}px)`]: {
		display: 'none !important',
	},
};
