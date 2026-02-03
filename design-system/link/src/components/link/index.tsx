/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type AnchorHTMLAttributes, forwardRef, type Ref } from 'react';

import { css } from '@compiled/react';

import type { RouterLinkComponentProps } from '@atlaskit/app-provider';
import { cssMap, cx, jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Anchor, type AnchorProps, Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	base: {
		fontFamily: token('font.family.body'),
	},
	baseT26Shape: {
		borderRadius: token('radius.xsmall'),
	},
	visitedLink: {
		'&:visited': {
			color: token('color.link.visited'),
		},
		// @ts-expect-error - chained pseudos are not supported properly
		'&:visited:hover': {
			color: token('color.link.visited'),
		},
		'&:visited:active': {
			color: token('color.link.visited.pressed'),
		},
		'&:visited:focus': {
			color: token('color.link.visited'),
		},
	},

	defaultAppearance: {
		textDecoration: 'underline',
		color: token('color.link'),
		'&:hover': {
			color: token('color.link'),
			textDecoration: 'none',
		},

		'&:active': {
			color: token('color.link.pressed'),
			textDecoration: 'none',
		},

		'&:focus': {
			color: token('color.link'),
			textDecoration: 'underline',
		},
	},

	subtleAppearance: {
		textDecoration: 'none',
		color: token('color.text.subtle'),

		'&:hover': {
			color: token('color.text.subtle'),
			textDecoration: 'underline',
		},

		'&:active': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			color: token('color.text') as any,
			textDecoration: 'underline',
		},

		'&:focus': {
			color: token('color.text.subtle'),
			textDecoration: 'none',
		},
	},

	inverseAppearance: {
		textDecoration: 'underline',
		color: token('color.text.inverse'),

		// Inverse links don't have visited styles,
		// so this needs to be reinforced to prevent global overrides.
		'&:visited': {
			color: token('color.text.inverse'),
		},

		'&:hover': {
			color: token('color.text.inverse'),
			textDecoration: 'none',
		},

		'&:active': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			color: token('color.text.inverse') as any,
			textDecoration: 'none',
		},

		'&:focus': {
			textDecoration: 'underline',
			color: token('color.text.inverse'),
		},
	},

	// Prevent the icon from wrapping onto a new line by itself
	// Using this technique involving a zero-width space: https://snook.ca/archives/html_and_css/icon-wrap-after-text
	iconWrapper: {
		display: 'inline',
		whiteSpace: 'nowrap',
		verticalAlign: 'baseline',
		position: 'relative',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		insetBlockStart: '0.11em' as any,
	},
});

const iconStyles = css({
	// Make icons relatively sized to text. This is important as text size is inherited,
	// so icons need to scale proportionally.
	width: '0.9em',
	height: '0.9em',
	// The icon should be relatively spaced from the text, so space tokens aren't suitable.
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	marginInlineStart: '.3em',
});

export type LinkProps<RouterLinkConfig extends Record<string, any> = never> = Omit<
	AnchorHTMLAttributes<HTMLAnchorElement>,
	'href' | 'onClick' | 'style' | 'children' | 'className'
> &
	Pick<
		AnchorProps<RouterLinkConfig>,
		'interactionName' | 'analyticsContext' | 'onClick' | 'testId' | 'newWindowLabel'
	> &
	RouterLinkComponentProps<RouterLinkConfig> & {
		/**
		 * The appearance of the link. Defaults to `default`. A `subtle` appearance will render the link with a lighter color and no underline in resting state. Use `inverse` when rendering on bold backgrounds to ensure that the link is easily visible.
		 */
		appearance?: 'default' | 'subtle' | 'inverse';
	};

const LinkWithoutRef = <RouterLinkConfig extends Record<string, any> = never>(
	{
		children,
		testId,
		appearance = 'default',
		newWindowLabel,
		target,
		// @ts-expect-error
		className: _preventedClassName,
		// @ts-expect-error
		style: _preventedStyle,
		...htmlAttributes
	}: LinkProps<RouterLinkConfig>,
	ref: Ref<HTMLAnchorElement>,
) => {
	return (
		<Anchor
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			{...htmlAttributes}
			target={target}
			ref={ref}
			xcss={cx(
				styles.base,
				fg('platform-dst-shape-theme-default') && styles.baseT26Shape,
				appearance === 'default' && styles.defaultAppearance,
				appearance === 'subtle' && styles.subtleAppearance,
				appearance === 'inverse' && styles.inverseAppearance,
				// Visited styles are not supported for inverse links due to contrast issues
				appearance !== 'inverse' && styles.visitedLink,
			)}
			testId={testId}
			componentName="Link"
			newWindowLabel={newWindowLabel}
		>
			{children}
			{target === '_blank' && (
				<Box as="span" xcss={styles.iconWrapper} testId={testId && `${testId}__icon`}>
					{/* Zero-width space to prevent the icon from wrapping onto new line */}
					&#65279;
					{/* Unfortunately Shortcut Icon had to be copied directly below to support visited styles.
          This is because icons have a default `color` and although it's set to inherit text color, due to strict security restrictions for visited links it did not allow the color to pass through to the SVG */}
					<svg width="12" height="12" viewBox="0 0 12 12" fill="none" css={iconStyles}>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M0 1.82609C0 0.817938 0.817938 0 1.82609 0H3.91304V1.04348H1.82609C1.39424 1.04348 1.04348 1.39424 1.04348 1.82609V10.1739C1.04348 10.6058 1.39424 10.9565 1.82609 10.9565H10.1739C10.6058 10.9565 10.9565 10.6058 10.9565 10.1739V8.08696H12V10.1739C12 11.1821 11.1821 12 10.1739 12H1.82609C0.817938 12 0 11.1821 0 10.1739V1.82609ZM7.04348 0H12V4.95652H10.9565V1.78133L6.36893 6.36893L5.63107 5.63107L10.2187 1.04348H7.04348V0Z"
							fill="currentColor"
						/>
					</svg>
				</Box>
			)}
		</Anchor>
	);
};

// Workarounds to support generic types with forwardRef
/**
 * __Link__
 *
 * A link is an inline text element that navigates to a new location when clicked.
 *
 * - [Examples](https://atlassian.design/components/primitives/link/examples)
 * - [Code](https://atlassian.design/components/primitives/link/code)
 * - [Usage](https://atlassian.design/components/primitives/link/usage)
 */
const Link = forwardRef(LinkWithoutRef) as <RouterLinkConfig extends Record<string, any> = never>(
	props: LinkProps<RouterLinkConfig> & {
		ref?: Ref<HTMLAnchorElement>;
	},
) => ReturnType<typeof LinkWithoutRef>;

export default Link;
