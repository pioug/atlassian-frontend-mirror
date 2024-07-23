/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { cssVar, defaultMargin, tagHeight } from '../../../constants';
import type { AppearanceType, TagColor } from '../../../index';
import * as styles from '../../../styles';

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
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	height: tagHeight,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	margin: defaultMargin,
	padding: token('space.0', '0px'),
	position: 'relative',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundColor: `var(${cssVar.color.background.default})`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderRadius: `var(${cssVar.borderRadius})`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	color: `var(${cssVar.color.text.default})`,
	cursor: 'default',
});

const baseStyles = css({
	display: 'inline-flex',
	boxSizing: 'border-box',
	minWidth: 0,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	height: tagHeight,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	margin: defaultMargin,
	position: 'relative',
	alignItems: 'center',
	gap: token('space.050', '4px'),
	backgroundColor: token('color.background.neutral.subtle'),
	border: 'solid',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderColor: `var(${cssVar.color.borderColor})`,
	borderRadius: token('border.radius', '3px'),
	borderWidth: token('border.width', '1px'),
	color: token('color.text'),
	cursor: 'default',
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
		outline: `2px solid ${styles.focusRingColors}`,
		outlineOffset: '2px ',
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
	const textLinkColors = isStandardLink
		? styles.textColors['standardLink']
		: styles.textColors[color];

	const backgroundHoverColors =
		isRemovable && !isLink
			? styles.backgroundColors[color]
			: styles.linkHoverBackgroundColors[color];

	const backgroundActiveColors =
		isRemovable && !isLink
			? styles.backgroundColors[color]
			: styles.linkActiveBackgroundColors[color];

	return (
		<span
			{...other}
			ref={ref}
			css={[
				fg('platform-component-visual-refresh') ? baseStyles : baseStylesOld,
				isInteractive &&
					(fg('platform-component-visual-refresh') ? focusRingStyles : focusRingStylesOld),
				fg('platform-component-visual-refresh') ? isLink && interactiveStyles : undefined,
				!fg('platform-component-visual-refresh') &&
					isLink &&
					!isStandardLink &&
					nonStandardLinkStyles,
				!fg('platform-component-visual-refresh') && isInteractive && interactiveStylesOld,
			]}
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				[cssVar.color.borderColor]: styles.borderColors[color],
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				[cssVar.color.text.default]: styles.textColors[color],
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				[cssVar.color.text.hover]: styles.textHoverColors[color],
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				[cssVar.color.text.active]: styles.textActiveColors[color],
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				[cssVar.color.text.link]: textLinkColors,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				[cssVar.color.background.default]: styles.backgroundColors[color],
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				[cssVar.color.background.hover]: backgroundHoverColors,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				[cssVar.color.background.active]: backgroundActiveColors,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				[cssVar.color.focusRing]: styles.focusRingColors,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				[cssVar.color.removeButton.default]: styles.removeButtonColors[color],
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				[cssVar.color.removeButton.hover]: styles.removeButtonHoverColors[color],
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				[cssVar.borderRadius]: styles.borderRadius[appearance],
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
