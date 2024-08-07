/* eslint-disable @atlaskit/design-system/no-deprecated-design-token-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { useHeading } from './heading-context';
import NewHeading from './heading.partial';
import type { HeadingProps, NewHeadingProps, OldHeadingProps } from './types';

// https://atlassian.design/foundations/typography
const levelMap = {
	h900: 'h1',
	h800: 'h1',
	h700: 'h2',
	h600: 'h3',
	h500: 'h4',
	h400: 'h5',
	h300: 'h6',
	// NB: These two levels are not covered at all by the existing @atlaskit/css-reset
	h200: 'div',
	h100: 'div',
} as const;

const headingResetStyles = css({
	color: token('color.text', '#172B4D'),
	marginBlock: token('space.0', '0px'),
});

const h900Styles = css({
	fontSize: token('font.size.600', '35px'),
	fontWeight: token('font.weight.medium', '500'),
	letterSpacing: '-0.01em',
	lineHeight: token('font.lineHeight.600', '40px'),
});

const h800Styles = css({
	fontSize: token('font.size.500', '29px'),
	fontWeight: token('font.weight.semibold', '600'),
	letterSpacing: '-0.01em',
	lineHeight: token('font.lineHeight.500', '32px'),
});

const h700Styles = css({
	fontSize: token('font.size.400', '24px'),
	fontWeight: token('font.weight.medium', '500'),
	letterSpacing: '-0.01em',
	lineHeight: token('font.lineHeight.400', '28px'),
});

const h600Styles = css({
	fontSize: token('font.size.300', '20px'),
	fontWeight: token('font.weight.medium', '500'),
	letterSpacing: '-0.008em',
	lineHeight: token('font.lineHeight.300', '24px'),
});

const h500Styles = css({
	fontSize: token('font.size.200', '16px'),
	fontWeight: token('font.weight.semibold', '600'),
	letterSpacing: '-0.006em',
	lineHeight: token('font.lineHeight.200', '20px'),
});

const h400Styles = css({
	fontSize: token('font.size.100', '14px'),
	fontWeight: token('font.weight.semibold', '600'),
	letterSpacing: '-0.003em',
	lineHeight: token('font.lineHeight.100', '16px'),
});

const h300Styles = css({
	fontSize: token('font.size.075', '12px'),
	fontWeight: token('font.weight.semibold', '600'),
	letterSpacing: 0,
	lineHeight: token('font.lineHeight.100', '16px'),
	textTransform: 'uppercase',
});

const h200Styles = css({
	fontSize: token('font.size.075', '12px'),
	fontWeight: token('font.weight.semibold', '600'),
	letterSpacing: 0,
	lineHeight: token('font.lineHeight.100', '16px'),
});

const h100Styles = css({
	fontSize: token('font.size.050', '11px'),
	fontWeight: token('font.weight.bold', '700'),
	letterSpacing: 0,
	lineHeight: token('font.lineHeight.100', '16px'),
});

const inverseStyles = css({
	color: token('color.text.inverse', '#FFF'),
});

const subtlestStyles = css({
	color: token('color.text.subtlest', '#6B778C'),
});

/**
 * __Heading__
 *
 * A heading is a typography component used to display text in different sizes and formats.
 *
 * @example
 *
 * ```jsx
 * import Heading from '@atlaskit/heading';
 *
 * const H100 = () => (
 *   <Heading level="h100">h100</Heading>
 * );
 * ```
 */
const OldHeading = ({ children, level, id, testId, as, color = 'default' }: OldHeadingProps) => {
	if (
		typeof process !== 'undefined' &&
		process.env.NODE_ENV !== 'production' &&
		as &&
		typeof as !== 'string'
	) {
		throw new Error('`as` prop should be a string.');
	}

	const [hLevel, inferredElement] = useHeading(levelMap[level!]);
	const Markup = as || inferredElement;
	const isSubtleHeading = level === 'h200' || level === 'h100';
	const needsAriaRole = Markup === 'div' && hLevel;

	return (
		<Markup
			id={id}
			data-testid={testId}
			role={needsAriaRole ? 'heading' : undefined}
			aria-level={needsAriaRole ? hLevel : undefined}
			css={[
				headingResetStyles,
				level === 'h100' && h100Styles,
				level === 'h200' && h200Styles,
				level === 'h300' && h300Styles,
				level === 'h400' && h400Styles,
				level === 'h500' && h500Styles,
				level === 'h600' && h600Styles,
				level === 'h700' && h700Styles,
				level === 'h800' && h800Styles,
				level === 'h900' && h900Styles,
				color === 'inverse' && inverseStyles,
				color === 'default' && isSubtleHeading && subtlestStyles,
			]}
		>
			{children}
		</Markup>
	);
};

/**
 * __Heading__
 *
 * A heading is a typography component used to display text in different sizes and formats.
 *
 * @example
 *
 * ```jsx
 * import Heading from '@atlaskit/heading';
 *
 * // New component
 * <Heading size="xxlarge">Page title</Heading>
 *
 * // Old component
 * const H100 = () => (
 *   <Heading level="h100">h100</Heading>
 * );
 * ```
 */
const Heading = ({ level, ...props }: HeadingProps) => {
	return level ? (
		// eslint-disable-next-line jsx-a11y/heading-has-content, @repo/internal/react/no-unsafe-spread-props
		<OldHeading level={level} {...(props as Omit<OldHeadingProps, 'level'>)} />
	) : (
		// eslint-disable-next-line jsx-a11y/heading-has-content, @repo/internal/react/no-unsafe-spread-props
		<NewHeading {...(props as NewHeadingProps)} />
	);
};

export default Heading;
