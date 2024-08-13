import { token } from '@atlaskit/tokens';

import { N200, N800 } from './colors';
import { gridSize } from './constants';
import type { ThemeProps } from './types';

/**
 * Font token fallbacks are verbose.
 * This object exists purely to make using fallbacks less cumbersome while we still need to use them.
 * Will be removed once fallbacks are no longer needed.
 *
 * This is referenced by the use-tokens-typography ESLint rule.
 */
export const fontFallback = {
	heading: {
		xxlarge:
			'normal 500 35px/40px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
		xlarge:
			'normal 600 29px/32px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
		large:
			'normal 500 24px/28px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
		medium:
			'normal 500 20px/24px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
		small:
			'normal 600 16px/20px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
		xsmall:
			'normal 600 14px/16px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
		xxsmall:
			'normal 600 12px/16px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
	},
	body: {
		large:
			'normal 400 16px/24px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
		medium:
			'normal 400 14px/20px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
		UNSAFE_small:
			'normal 400 12px/16px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
		small:
			'normal 400 11px/16px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
	},
};

const baseHeading = (size: number, lineHeight: number) => ({
	fontSize: `${size / 14}em`,
	fontStyle: 'inherit',
	lineHeight: lineHeight / size,
});

export const headingSizes = {
	h900: { size: 35, lineHeight: 40 },
	h800: { size: 29, lineHeight: 32 },
	h700: { size: 24, lineHeight: 28 },
	h600: { size: 20, lineHeight: 24 },
	h500: { size: 16, lineHeight: 20 },
	h400: { size: 14, lineHeight: 16 },
	h300: { size: 12, lineHeight: 16 },
	h200: { size: 12, lineHeight: 16 },
	h100: { size: 11, lineHeight: 16 },
};

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-386 Internal documentation for deprecation (no external access)}
 * @deprecated {@link https://atlassian.design/components/heading Use `@atlaskit/heading` instead.}
 */
export const h900 = (props: ThemeProps = {}) => ({
	...baseHeading(headingSizes.h900.size, headingSizes.h900.lineHeight),
	color: token('color.text', N800),
	fontWeight: token('font.weight.medium', '500'),
	letterSpacing: `-0.01em`,
	marginTop: `${gridSize() * 6.5}px`,
});

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-386 Internal documentation for deprecation (no external access)}
 * @deprecated {@link https://atlassian.design/components/heading Use `@atlaskit/heading` instead.}
 */
export const h800 = (props: ThemeProps = {}) => ({
	...baseHeading(headingSizes.h800.size, headingSizes.h800.lineHeight),
	color: token('color.text', N800),
	fontWeight: token('font.weight.semibold', '600'),
	letterSpacing: `-0.01em`,
	marginTop: `${gridSize() * 5}px`,
});

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-386 Internal documentation for deprecation (no external access)}
 * @deprecated {@link https://atlassian.design/components/heading Use `@atlaskit/heading` instead.}
 */
export const h700 = (props: ThemeProps = {}) => ({
	...baseHeading(headingSizes.h700.size, headingSizes.h700.lineHeight),
	color: token('color.text', N800),
	fontWeight: token('font.weight.medium', '500'),
	letterSpacing: `-0.01em`,
	marginTop: `${gridSize() * 5}px`,
});

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-386 Internal documentation for deprecation (no external access)}
 * @deprecated {@link https://atlassian.design/components/heading Use `@atlaskit/heading` instead.}
 */
export const h600 = (props: ThemeProps = {}) => ({
	...baseHeading(headingSizes.h600.size, headingSizes.h600.lineHeight),
	color: token('color.text', N800),
	fontWeight: token('font.weight.medium', '500'),
	letterSpacing: `-0.008em`,
	marginTop: `${gridSize() * 3.5}px`,
});

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-386 Internal documentation for deprecation (no external access)}
 * @deprecated {@link https://atlassian.design/components/heading Use `@atlaskit/heading` instead.}
 */
export const h500 = (props: ThemeProps = {}) => ({
	...baseHeading(headingSizes.h500.size, headingSizes.h500.lineHeight),
	color: token('color.text', N800),
	fontWeight: token('font.weight.semibold', '600'),
	letterSpacing: `-0.006em`,
	marginTop: `${gridSize() * 3}px`,
});

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-386 Internal documentation for deprecation (no external access)}
 * @deprecated {@link https://atlassian.design/components/heading Use `@atlaskit/heading` instead.}
 */
export const h400 = (props: ThemeProps = {}) => ({
	...baseHeading(headingSizes.h400.size, headingSizes.h400.lineHeight),
	color: token('color.text', N800),
	fontWeight: token('font.weight.semibold', '600'),
	letterSpacing: `-0.003em`,
	marginTop: `${gridSize() * 2}px`,
});

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-386 Internal documentation for deprecation (no external access)}
 * @deprecated {@link https://atlassian.design/components/heading Use `@atlaskit/heading` instead.}
 */
export const h300 = (props: ThemeProps = {}) => ({
	...baseHeading(headingSizes.h300.size, headingSizes.h300.lineHeight),
	color: token('color.text', N800),
	fontWeight: token('font.weight.semibold', '600'),
	marginTop: `${gridSize() * 2.5}px`,
	textTransform: 'uppercase' as const,
});

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-386 Internal documentation for deprecation (no external access)}
 * @deprecated {@link https://atlassian.design/components/heading Use `@atlaskit/heading` instead.}
 */
export const h200 = (props: ThemeProps = {}) => ({
	...baseHeading(headingSizes.h200.size, headingSizes.h200.lineHeight),
	color: token('color.text.subtlest', N200),
	fontWeight: token('font.weight.semibold', '600'),
	marginTop: `${gridSize() * 2}px`,
});

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-386 Internal documentation for deprecation (no external access)}
 * @deprecated {@link https://atlassian.design/components/heading Use `@atlaskit/heading` instead.}
 */
export const h100 = (props: ThemeProps = {}) => ({
	...baseHeading(headingSizes.h100.size, headingSizes.h100.lineHeight),
	color: token('color.text.subtlest', N200),
	fontWeight: token('font.weight.bold', '700'),
	marginTop: `${gridSize() * 2}px`,
});
