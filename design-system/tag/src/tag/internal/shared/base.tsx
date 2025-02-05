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

const cssVar = {
	color: {
		background: {
			default: '--ds-cb',
			hover: '--ds-cbh',
			active: '--ds-cba',
		},
		borderColor: '--ds-bc',
		focusRing: '--ds-cfr',
		text: {
			default: '--ds-ct',
			hover: '--ds-cth',
			active: '--ds-ctp',
			link: '--ds-ctl',
		},
		removeButton: {
			default: '--ds-rb',
			hover: '--ds-rbh',
		},
	},
	borderRadius: '--ds-br',
};

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
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
	backgroundColor: `var(${cssVar.color.background.default})`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
	borderRadius: `var(${cssVar.borderRadius})`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
	color: `var(${cssVar.color.text.default})`,
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
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
	borderColor: `var(${cssVar.color.borderColor})`,
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
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		backgroundColor: `var(${cssVar.color.background.hover})`,
	},
	'&:active': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		backgroundColor: `var(${cssVar.color.background.active})`,
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
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		boxShadow: `0 0 0 2px var(${cssVar.color.focusRing})`,
		outline: 'none',
	},
});

const focusRingStyles = css({
	'&:focus-within': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		outline: `2px solid ${token('color.border.focused')}`,
		outlineOffset: token('space.025', '2px'),
	},
});

// To be removed with platform-component-visual-refresh (BLU-2992)
const nonStandardLinkStyles = css({
	'&:active': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		color: `var(${cssVar.color.text.active})`,
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
			style={{
				// NOTE: The vast majority of these styles have zero purpose to be runtime computed
				// This can all be migrated to statically distributed atomic CSS with Compiled in the future
				// The main reason for not touching this is there is to avoid excessive changes in the same PR on non-visual-refresh code

				/* eslint-disable @atlaskit/ui-styling-standard/enforce-style-prop */
				/* eslint-disable @atlaskit/ui-styling-standard/no-imported-style-values */
				[cssVar.color.borderColor]: borderColors[color],
				[cssVar.color.text.default]: textColors[color],
				[cssVar.color.text.hover]: textHoverColors[color],
				[cssVar.color.text.active]: textActiveColors[color],
				[cssVar.color.text.link]: textLinkColors,
				[cssVar.color.background.default]: backgroundColors[color],
				[cssVar.color.background.hover]: backgroundHoverColors,
				[cssVar.color.background.active]: backgroundActiveColors,
				[cssVar.color.focusRing]: focusRingColors,
				[cssVar.color.removeButton.default]: removeButtonColors[color],
				[cssVar.color.removeButton.hover]: removeButtonHoverColors[color],
				[cssVar.borderRadius]: appearance === 'rounded' ? '10px' : '3px',
				/* eslint-enable @atlaskit/ui-styling-standard/enforce-style-prop */
				/* eslint-enable @atlaskit/ui-styling-standard/no-imported-style-values */

				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				...style,
			}}
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
