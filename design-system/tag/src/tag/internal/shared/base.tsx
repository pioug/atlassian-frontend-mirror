/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { cssVar, defaultMargin, tagHeight } from '../../../constants';
import type { AppearanceType, TagColor } from '../../../index';
import * as styles from '../../../styles';

type BaseProps = React.AllHTMLAttributes<HTMLElement> & {
	before?: JSX.Element;
	contentElement: JSX.Element;
	after?: JSX.Element;
	testId?: string;
	appearance?: AppearanceType;
	color?: TagColor;
};

const baseStyles = css({
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

const interactiveStyles = css({
	'&:hover': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		backgroundColor: `var(${cssVar.color.background.hover})`,
	},
	'&:active': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		backgroundColor: `var(${cssVar.color.background.active})`,
	},
});

const focusRingStyles = css({
	'&:focus-within': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		boxShadow: `0 0 0 2px var(${cssVar.color.focusRing})`,
		outline: 'none',
	},
});

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
				baseStyles,
				(isRemovable || isLink) && focusRingStyles,
				isLink && !isStandardLink && nonStandardLinkStyles,
				isInteractive && interactiveStyles,
			]}
			style={{
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
