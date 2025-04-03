/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, type MouseEvent } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { N700 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { PRODUCT_HOME_BREAKPOINT } from '../../common/constants';
import { useTheme } from '../../theme';
import { stripEmptyProperties } from '../../utils';

import { type ProductHomeProps } from './types';
import { getTag } from './utils';

const VAR_LOGO_MAX_WIDTH = '--logo-max-width';

const VAR_PRODUCT_HOME_COLOR_ACTIVE = '--product-home-color-active';
const VAR_PRODUCT_HOME_BACKGROUND_COLOR_ACTIVE = '--product-home-bg-color-active';
const VAR_PRODUCT_HOME_BOX_SHADOW_ACTIVE = '--product-home-box-shadow-active';

const VAR_PRODUCT_HOME_COLOR_FOCUS = '--product-home-color-focus';
const VAR_PRODUCT_HOME_BACKGROUND_COLOR_FOCUS = '--product-home-bg-color-focus';
const VAR_PRODUCT_HOME_BOX_SHADOW_FOCUS = '--product-home-box-shadow-focus';

const VAR_PRODUCT_HOME_COLOR_HOVER = '--product-home-color-hover';
const VAR_PRODUCT_HOME_BACKGROUND_COLOR_HOVER = '--product-home-bg-color-hover';
const VAR_PRODUCT_HOME_BOX_SHADOW_HOVER = '--product-home-box-shadow-hover';

const productHomeButtonStyles = css({
	display: 'flex',
	padding: token('space.050', '4px'),
	alignItems: 'center',
	background: 'none',
	border: 0,
	borderRadius: token('border.radius', '3px'),
	color: 'inherit',
	cursor: 'pointer',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&::-moz-focus-inner': {
		border: 0,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&:first-of-type': {
		marginInlineStart: 0,
	},
	'&:hover': {
		backgroundColor: `var(${VAR_PRODUCT_HOME_BACKGROUND_COLOR_HOVER})`,
		boxShadow: `var(${VAR_PRODUCT_HOME_BOX_SHADOW_HOVER})`,
		color: `var(${VAR_PRODUCT_HOME_COLOR_HOVER})`,
	},
	'&:active': {
		backgroundColor: `var(${VAR_PRODUCT_HOME_BACKGROUND_COLOR_ACTIVE})`,
		boxShadow: `var(${VAR_PRODUCT_HOME_BOX_SHADOW_ACTIVE})`,
		color: `var(${VAR_PRODUCT_HOME_COLOR_ACTIVE})`,
	},
	'&:focus-visible': {
		backgroundColor: `var(${VAR_PRODUCT_HOME_BACKGROUND_COLOR_FOCUS})`,
		color: `var(${VAR_PRODUCT_HOME_COLOR_FOCUS})`,
		outline: `${token('border.width.outline', '2px')} solid ${token(
			'color.border.focused',
			'#4C9AFF',
		)}`,
	},

	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'div&': {
		pointerEvents: 'none',
	},
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`@media (max-width: ${PRODUCT_HOME_BREAKPOINT - 0.1}px)`]: {
		margin: `0 ${token('space.100', '8px')}`,
	},
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`@media (min-width: ${PRODUCT_HOME_BREAKPOINT}px)`]: {
		margin: `0 ${token('space.200', '16px')}`,
	},
});

const productLogoStyles = css({
	// Ensure anything passed into
	// productHome is aligned correctly
	display: 'flex',
	maxWidth: `var(${VAR_LOGO_MAX_WIDTH})`,
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > *': {
		maxHeight: 24,
	},
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > span > svg': {
		maxWidth: `var(${VAR_LOGO_MAX_WIDTH})`,
	},
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`@media (max-width: ${PRODUCT_HOME_BREAKPOINT - 0.1}px)`]: {
		display: 'none',
	},
});

const customMaxHeightStyles = css({
	maxHeight: 28,
});

const productIconStyles = css({
	// Ensure anything passed into
	// productHome is aligned correctly
	display: 'flex',
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > *': {
		maxHeight: 24,
	},
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`@media (min-width: ${PRODUCT_HOME_BREAKPOINT}px)`]: {
		display: 'none',
	},
});

const siteTitleStyles = css({
	display: 'flex',
	alignItems: 'center',
	marginInlineEnd: token('space.050', '4px'),
	marginInlineStart: token('space.050', '4px'),
	paddingInlineEnd: token('space.200', '16px'),
});

/**
 * __Product home__
 *
 * The ProductHome component displays the product visual identity composed of:
 * logo, icon, and optional text. Values for logo and icon are never displayed
 * at the same time, where icon is used only when space is restricted. Should be
 * passed into `AtlassianNavigation`'s `renderProductHome` prop.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#product-home)
 * - [Code](https://atlassian.design/components/atlassian-navigation/code)
 */
const ProductHome = ({
	'aria-label': ariaLabel,
	href,
	icon: Icon,
	logo: Logo,
	logoMaxWidth = 260,
	onClick,
	onMouseDown,
	siteTitle,
	testId,
	...rest
}: ProductHomeProps) => {
	const theme = useTheme();
	const primaryButton = theme.mode.primaryButton;
	// After the brand refresh, iconColor and textColor should be set to 'undefined' to allow the original
	// multi-color logo tile colors to be visible, rather than a hardcoded blue.
	let {
		iconColor = fg('platform-team25-app-icon-tiles') ? undefined : 'inherit',
		textColor = fg('platform-team25-app-icon-tiles') ? undefined : theme.mode.productHome.color,
	} = theme.mode.productHome;

	// The default theme is set at module scope and immediately used in context.
	// To allow the feature flag to switch the logo color at runtime, we also detect the original hardcoded
	// values and override them to undefined.
	if (
		iconColor === '#357DE8' &&
		textColor === token('color.text', N700) &&
		fg('platform-team25-app-icon-tiles')
	) {
		iconColor = undefined;
		textColor = undefined;
	}

	const Tag = getTag(onClick, href);

	const preventFocusRing = (e: MouseEvent<HTMLElement>) => {
		e.preventDefault();
		onMouseDown && onMouseDown(e);
	};

	const productHomeButtonDynamicStyles = stripEmptyProperties({
		[VAR_PRODUCT_HOME_COLOR_ACTIVE]: primaryButton.active.color,
		[VAR_PRODUCT_HOME_BACKGROUND_COLOR_ACTIVE]: primaryButton.active.backgroundColor,
		[VAR_PRODUCT_HOME_BOX_SHADOW_ACTIVE]: primaryButton.active.boxShadow,
		[VAR_PRODUCT_HOME_COLOR_FOCUS]: primaryButton.focus.color,
		[VAR_PRODUCT_HOME_BACKGROUND_COLOR_FOCUS]: primaryButton.focus.backgroundColor,
		[VAR_PRODUCT_HOME_BOX_SHADOW_FOCUS]: primaryButton.focus.boxShadow,
		[VAR_PRODUCT_HOME_COLOR_HOVER]: primaryButton.hover.color,
		[VAR_PRODUCT_HOME_BACKGROUND_COLOR_HOVER]: primaryButton.hover.backgroundColor,
		[VAR_PRODUCT_HOME_BOX_SHADOW_HOVER]: primaryButton.hover.boxShadow,
		[VAR_LOGO_MAX_WIDTH]: `${logoMaxWidth}px`,
	});

	return (
		<Fragment>
			<Tag
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={productHomeButtonDynamicStyles as React.CSSProperties}
				css={productHomeButtonStyles}
				href={href}
				onClick={onClick}
				onMouseDown={preventFocusRing}
				data-testid={testId && `${testId}-container`}
				aria-label={ariaLabel}
				// Made all props explicit, leaving just in case
				// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
				{...rest}
			>
				<div
					css={[customMaxHeightStyles, productLogoStyles]}
					data-testid={testId && `${testId}-logo`}
				>
					<Logo
						iconColor={iconColor}
						textColor={textColor}
						// @ts-ignore - The new icons don't have an appearance prop at the moment
						appearance={fg('platform-team25-app-icon-tiles') ? 'brand' : undefined}
					/>
				</div>
				<div
					css={[customMaxHeightStyles, productIconStyles]}
					data-testid={testId && `${testId}-icon`}
				>
					<Icon
						iconColor={iconColor}
						size={fg('platform-team25-app-icon-tiles') ? 'small' : undefined}
						// @ts-ignore - The new icons don't have an appearance prop at the moment
						appearance={fg('platform-team25-app-icon-tiles') ? 'brand' : undefined}
					/>
				</div>
			</Tag>
			{siteTitle && (
				<div
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={
						{
							borderRight: theme.mode.productHome.borderRight,
						} as React.CSSProperties
					}
					css={siteTitleStyles}
					data-testid={testId && `${testId}-site-title`}
				>
					{siteTitle}
				</div>
			)}
		</Fragment>
	);
};

export default ProductHome;
