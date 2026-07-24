import { media } from './media';
/**
 * Keep `UNSAFE_media` for backwards compatibility.
 */
export const UNSAFE_media: {
	above: {
		readonly xxs: '@media all';
		readonly xs: '@media (min-width: 30rem)';
		readonly sm: '@media (min-width: 48rem)';
		readonly md: '@media (min-width: 64rem)';
		readonly lg: '@media (min-width: 90rem)';
		readonly xl: '@media (min-width: 110.5rem)';
	};
	only: {
		readonly xxs: '@media (min-width: 0rem) and (max-width: 29.99rem)';
		readonly xs: '@media (min-width: 30rem) and (max-width: 47.99rem)';
		readonly sm: '@media (min-width: 48rem) and (max-width: 63.99rem)';
		readonly md: '@media (min-width: 64rem) and (max-width: 89.99rem)';
		readonly lg: '@media (min-width: 90rem) and (max-width: 110.49rem)';
		readonly xl: '@media (min-width: 110.5rem)';
	};
	below: {
		readonly xs: '@media not all and (min-width: 30rem)';
		readonly sm: '@media not all and (min-width: 48rem)';
		readonly md: '@media not all and (min-width: 64rem)';
		readonly lg: '@media not all and (min-width: 90rem)';
		readonly xl: '@media not all and (min-width: 110.5rem)';
	};
} = media;
