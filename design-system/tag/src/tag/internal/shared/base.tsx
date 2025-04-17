/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import type { AppearanceType, TagColor } from '../../../index';
import {
	backgroundColors,
	borderColors,
	focusRingColors,
	linkActiveBackgroundColors,
	linkHoverBackgroundColors,
	removeButtonColors,
	removeButtonHoverColors,
	textActiveColors,
	textColors,
	textHoverColors,
} from '../../../styles';

const borderColorCssVar = '--ds-bc';
const focusRingCssVar = '--ds-cfr';
const textLinkCssVar = '--ds-ctl';
const textDefaultCssVar = '--ds-ct';
const textHoverCssVar = '--ds-cth';
const textActiveCssVar = '--ds-ctp';
const backgroundDefaultCssVar = '--ds-cb';
const backgroundHoverCssVar = '--ds-cbh';
const backgroundActiveCssVar = '--ds-cba';
const removeButtonDefaultCssVar = '--ds-rb';
const removeButtonHoverCssVar = '--ds-rbh';
const borderRadiusCssVar = '--ds-br';

type BaseProps = React.AllHTMLAttributes<HTMLElement> & {
	before?: JSX.Element;
	contentElement: JSX.Element;
	after?: JSX.Element;
	testId?: string;
	/**
	 * To be removed with platform-component-visual-refresh (BLU-2992)
	 */
	appearance?: AppearanceType;
	color?: TagColor;
};

// To be removed with platform-component-visual-refresh (BLU-2992)
const baseStylesOld = css({
	display: 'inline-flex',
	minWidth: 0,
	height: token('space.250'),
	position: 'relative',
	backgroundColor: `var(${backgroundDefaultCssVar})`,
	borderRadius: `var(${borderRadiusCssVar})`,
	color: `var(${textDefaultCssVar})`,
	cursor: 'default',
	marginBlock: token('space.050'),
	marginInline: token('space.050'),
	paddingBlock: token('space.0', '0px'),
	paddingInline: token('space.0', '0px'),
});

const baseStyles = css({
	display: 'inline-flex',
	boxSizing: 'border-box',
	minWidth: 0,
	height: token('space.250'),
	position: 'relative',
	alignItems: 'center',
	gap: token('space.050', '4px'),
	backgroundColor: token('color.background.neutral.subtle'),
	borderColor: `var(${borderColorCssVar})`,
	borderRadius: token('border.radius', '3px'),
	borderStyle: 'solid',
	borderWidth: token('border.width', '1px'),
	color: token('color.text'),
	cursor: 'default',
	marginBlock: token('space.050'),
	marginInline: token('space.050'),
	paddingInline: token('space.050', '4px'),
});

// To be removed with platform-component-visual-refresh (BLU-2992)
const interactiveStylesOld = css({
	'&:hover': {
		backgroundColor: `var(${backgroundHoverCssVar})`,
	},
	'&:active': {
		backgroundColor: `var(${backgroundActiveCssVar})`,
	},
});

const interactiveStyles = css({
	'&:hover': {
		backgroundColor: token('color.background.neutral.subtle.hovered'),
	},
	'&:active': {
		backgroundColor: token('color.background.neutral.subtle.pressed'),
	},
});

// To be removed with platform-component-visual-refresh (BLU-2992)
const focusRingStylesOld = css({
	'&:focus-within': {
		boxShadow: `0 0 0 2px var(${focusRingCssVar})`,
		outline: 'none',
	},
});

const focusRingStyles = css({
	'&:focus-within': {
		outline: `2px solid ${token('color.border.focused')}`,
		outlineOffset: token('space.025', '2px'),
	},
});

// To be removed with platform-component-visual-refresh (BLU-2992)
const nonStandardLinkStyles = css({
	'&:active': {
		color: `var(${textActiveCssVar})`,
	},
});

const BaseTag = React.forwardRef<HTMLDivElement, BaseProps>(function BaseTag(
	{
		before,
		contentElement,
		after,
		testId,
		appearance = 'default',
		style,
		color = 'standard',
		href,
		className,
		...other
	}: BaseProps,
	ref,
) {
	const isLink = Boolean(href);
	const isRemovable = Boolean(after);
	const isInteractive = isLink || isRemovable;
	const isStandardLink = isLink && color === 'standard';

	// Change link text color if  the tag is standard color
	const textLinkColors = isStandardLink ? textColors['standardLink'] : textColors[color];

	const backgroundHoverColors =
		isRemovable && !isLink ? backgroundColors[color] : linkHoverBackgroundColors[color];

	const backgroundActiveColors =
		isRemovable && !isLink ? backgroundColors[color] : linkActiveBackgroundColors[color];

	return (
		<span
			{...other}
			ref={ref}
			css={[
				fg('platform-component-visual-refresh') ? baseStyles : baseStylesOld,
				isInteractive
					? fg('platform-component-visual-refresh')
						? focusRingStyles
						: focusRingStylesOld
					: undefined,
				isLink && fg('platform-component-visual-refresh') && interactiveStyles,
				!fg('platform-component-visual-refresh') &&
					isLink &&
					!isStandardLink &&
					nonStandardLinkStyles,
				!fg('platform-component-visual-refresh') && isInteractive && interactiveStylesOld,
			]}
			style={
				{
					// NOTE: The vast majority of these styles have zero purpose to be runtime computed
					// This can all be migrated to statically distributed atomic CSS with Compiled in the future
					// The main reason for not touching this is there is to avoid excessive changes in the same PR on non-visual-refresh code

					/* eslint-disable @atlaskit/ui-styling-standard/enforce-style-prop */
					/* eslint-disable @atlaskit/ui-styling-standard/no-imported-style-values */
					[borderColorCssVar]: borderColors[color],
					[textDefaultCssVar]: textColors[color],
					[textHoverCssVar]: textHoverColors[color],
					[textActiveCssVar]: textActiveColors[color],
					[textLinkCssVar]: textLinkColors,
					[backgroundDefaultCssVar]: backgroundColors[color],
					[backgroundHoverCssVar]: backgroundHoverColors,
					[backgroundActiveCssVar]: backgroundActiveColors,
					[focusRingCssVar]: focusRingColors,
					[removeButtonDefaultCssVar]: removeButtonColors[color],
					[removeButtonHoverCssVar]: removeButtonHoverColors[color],
					[borderRadiusCssVar]: appearance === 'rounded' ? '10px' : '3px',
					/* eslint-enable @atlaskit/ui-styling-standard/enforce-style-prop */
					/* eslint-enable @atlaskit/ui-styling-standard/no-imported-style-values */

					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					...style,
				} as React.CSSProperties
			}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={className}
			data-testid={testId}
		>
			{before}
			{contentElement}
			{after}
		</span>
	);
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default BaseTag;
