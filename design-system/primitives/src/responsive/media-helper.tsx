/**
 * This is an object of usable media query helpers using our internal breakpoints configuration.
 *
 * When using Compiled CSS-in-JS, please ensure that only a single declaration can take effect at a time.
 * This means that you should avoid multiple breakpoints taking effect at the same time,
 * eg. ```{ [media.above.xs]: { color: 'red' }, [media.above.sm]: { color: 'green' }}```.
 * Instead, make sure that only one breakpoint can take effect at a time,
 * e.g, ```{ [media.only.xs]: { color: 'red' }, [media.above.sm]: { color: 'green' }}```.
 * For more details, please see <https://compiledcssinjs.com/docs/atomic-css#selector-specificity>.
 */
export const media = {
	above: {
		xxs: '@media all',
		xs: '@media (min-width: 30rem)',
		sm: '@media (min-width: 48rem)',
		md: '@media (min-width: 64rem)',
		lg: '@media (min-width: 90rem)',
		xl: '@media (min-width: 110.5rem)',
	} as const,
	only: {
		xxs: '@media (min-width: 0rem) and (max-width: 29.99rem)',
		xs: '@media (min-width: 30rem) and (max-width: 47.99rem)',
		sm: '@media (min-width: 48rem) and (max-width: 63.99rem)',
		md: '@media (min-width: 64rem) and (max-width: 89.99rem)',
		lg: '@media (min-width: 90rem) and (max-width: 110.49rem)',
		xl: '@media (min-width: 110.5rem)',
	} as const,
	below: {
		xs: '@media not all and (min-width: 30rem)',
		sm: '@media not all and (min-width: 48rem)',
		md: '@media not all and (min-width: 64rem)',
		lg: '@media not all and (min-width: 90rem)',
		xl: '@media not all and (min-width: 110.5rem)',
	} as const,
};

/**
 * Keep `UNSAFE_media` for backwards compatibility.
 */
export const UNSAFE_media: {
    above: {
        readonly xxs: "@media all";
        readonly xs: "@media (min-width: 30rem)";
        readonly sm: "@media (min-width: 48rem)";
        readonly md: "@media (min-width: 64rem)";
        readonly lg: "@media (min-width: 90rem)";
        readonly xl: "@media (min-width: 110.5rem)";
    }; only: {
        readonly xxs: "@media (min-width: 0rem) and (max-width: 29.99rem)";
        readonly xs: "@media (min-width: 30rem) and (max-width: 47.99rem)";
        readonly sm: "@media (min-width: 48rem) and (max-width: 63.99rem)";
        readonly md: "@media (min-width: 64rem) and (max-width: 89.99rem)";
        readonly lg: "@media (min-width: 90rem) and (max-width: 110.49rem)";
        readonly xl: "@media (min-width: 110.5rem)";
    }; below: {
        readonly xs: "@media not all and (min-width: 30rem)";
        readonly sm: "@media not all and (min-width: 48rem)";
        readonly md: "@media not all and (min-width: 64rem)";
        readonly lg: "@media not all and (min-width: 90rem)";
        readonly xl: "@media not all and (min-width: 110.5rem)";
    };
} = media;
