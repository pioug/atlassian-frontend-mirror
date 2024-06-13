/** @jsx jsx */
import { Fragment, type MouseEvent } from 'react';

import { css, jsx } from '@emotion/react';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { B200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { PRODUCT_HOME_BREAKPOINT } from '../../common/constants';
import { useTheme } from '../../theme';

import { type CustomProductHomeProps } from './types';
import { getTag } from './utils';

const VAR_PRODUCT_HOME_COLOR_ACTIVE = '--product-home-color-active';
const VAR_PRODUCT_HOME_BACKGROUND_COLOR_ACTIVE = '--product-home-bg-color-active';
const VAR_PRODUCT_HOME_BOX_SHADOW_ACTIVE = '--product-home-box-shadow-active';

const VAR_PRODUCT_HOME_COLOR_FOCUS = '--product-home-color-focus';
const VAR_PRODUCT_HOME_BACKGROUND_COLOR_FOCUS = '--product-home-bg-color-focus';
const VAR_PRODUCT_HOME_BOX_SHADOW_FOCUS = '--product-home-box-shadow-focus';

const VAR_PRODUCT_HOME_COLOR_HOVER = '--product-home-color-hover';
const VAR_PRODUCT_HOME_BACKGROUND_COLOR_HOVER = '--product-home-bg-color-hover';
const VAR_PRODUCT_HOME_BOX_SHADOW_HOVER = '--product-home-box-shadow-hover';

const productLogoStyles = css({
	// Ensure anything passed into
	// productHome is aligned correctly
	display: 'flex',
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
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`@media (min-width: ${PRODUCT_HOME_BREAKPOINT}px)`]: {
		display: 'none',
	},
});

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
		outline: `2px solid ${token('color.border.focused', B200)}`,
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

const siteTitleStyles = css({
	display: 'flex',
	alignItems: 'center',
	marginInlineEnd: token('space.050', '4px'),
	marginInlineStart: token('space.050', '4px'),
	paddingInlineEnd: token('space.200', '16px'),
});

const hideSiteTitleStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`@media (max-width: ${PRODUCT_HOME_BREAKPOINT - 0.1}px)`]: {
		display: 'none',
	},
});

/**
 * __Custom product home__
 *
 * Use `CustomProductHome` to provide a custom logo and icon with URLs.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#custom-product-home)
 * - [Code](https://atlassian.design/components/atlassian-navigation/code)
 */
const CustomProductHome = (props: CustomProductHomeProps) => {
	const {
		iconAlt,
		iconUrl,
		logoAlt,
		logoUrl,
		href,
		onClick,
		siteTitle,
		onMouseDown,
		testId,
		logoMaxWidth = 260,
		...rest
	} = props;
	const theme = useTheme();
	const primaryButton = theme.mode.primaryButton;
	const Tag = getTag(onClick, href);

	const preventFocusRing = (event: MouseEvent<HTMLElement>) => {
		event.preventDefault();
		onMouseDown && onMouseDown(event);
	};

	const productHomeButtonDynamicStyles = {
		[VAR_PRODUCT_HOME_COLOR_ACTIVE]: primaryButton.active.color,
		[VAR_PRODUCT_HOME_BACKGROUND_COLOR_ACTIVE]: primaryButton.active.backgroundColor,
		[VAR_PRODUCT_HOME_BOX_SHADOW_ACTIVE]: primaryButton.active.boxShadow,
		[VAR_PRODUCT_HOME_COLOR_FOCUS]: primaryButton.focus.color,
		[VAR_PRODUCT_HOME_BACKGROUND_COLOR_FOCUS]: primaryButton.focus.backgroundColor,
		[VAR_PRODUCT_HOME_BOX_SHADOW_FOCUS]: primaryButton.focus.boxShadow,
		[VAR_PRODUCT_HOME_COLOR_HOVER]: primaryButton.hover.color,
		[VAR_PRODUCT_HOME_BACKGROUND_COLOR_HOVER]: primaryButton.hover.backgroundColor,
		[VAR_PRODUCT_HOME_BOX_SHADOW_HOVER]: primaryButton.hover.boxShadow,
	};

	return (
		<Fragment>
			<Tag
				href={href}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={productHomeButtonDynamicStyles as React.CSSProperties}
				css={productHomeButtonStyles}
				onClick={onClick}
				onMouseDown={preventFocusRing}
				data-testid={testId && `${testId}-container`}
				// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
				{...rest}
			>
				{logoUrl && (
					<img
						style={{ maxWidth: logoMaxWidth }}
						css={[customMaxHeightStyles, productLogoStyles]}
						src={logoUrl}
						alt={logoAlt}
						data-testid={testId && `${testId}-logo`}
					/>
				)}
				{iconUrl && (
					<img
						style={{ maxWidth: logoMaxWidth }}
						css={[customMaxHeightStyles, productIconStyles]}
						src={iconUrl}
						alt={iconAlt}
						data-testid={testId && `${testId}-icon`}
					/>
				)}
			</Tag>
			{siteTitle && (
				<div
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={
						{
							borderRight: theme.mode.productHome.borderRight,
						} as React.CSSProperties
					}
					css={[
						siteTitleStyles,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
						getBooleanFF('platform.design-system-team.navigation-v2-no-jank_5yhbd') &&
							hideSiteTitleStyles,
					]}
					data-testid={testId && `${testId}-site-title`}
				>
					{siteTitle}
				</div>
			)}
		</Fragment>
	);
};

export default CustomProductHome;
