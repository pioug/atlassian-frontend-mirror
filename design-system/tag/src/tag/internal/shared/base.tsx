/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import type { AppearanceType, TagColor } from '../../../index';

// Border colors - Hardcoded for Visual Refresh - to be removed with labelling system work
const borderColors = cssMap({
	standard: { borderColor: '#B7B9BE' },
	blue: { borderColor: '#669DF1' },
	red: { borderColor: '#F87168' },
	yellow: { borderColor: '#DDB30E' },
	green: { borderColor: '#4BCE97' },
	teal: { borderColor: '#6CC3E0' },
	purple: { borderColor: '#C97CF4' },
	lime: { borderColor: '#94C748' },
	magenta: { borderColor: '#E774BB' },
	orange: { borderColor: '#FCA700' },
	grey: { borderColor: '#B7B9BE' },
	standardLink: { borderColor: '#B7B9BE' },
	blueLight: { borderColor: '#669DF1' },
	redLight: { borderColor: '#F87168' },
	yellowLight: { borderColor: '#DDB30E' },
	greenLight: { borderColor: '#4BCE97' },
	tealLight: { borderColor: '#6CC3E0' },
	purpleLight: { borderColor: '#C97CF4' },
	limeLight: { borderColor: '#94C748' },
	magentaLight: { borderColor: '#E774BB' },
	orangeLight: { borderColor: '#FCA700' },
	greyLight: { borderColor: '#B7B9BE' },
});

type BaseProps = React.AllHTMLAttributes<HTMLElement> & {
	before?: JSX.Element;
	contentElement: JSX.Element;
	after?: JSX.Element;
	testId?: string;
	// Not used. To be removed with the labelling system work
	appearance?: AppearanceType;
	color?: TagColor;
};

const baseStyles = css({
	display: 'inline-flex',
	boxSizing: 'border-box',
	minWidth: 0,
	height: token('space.250'),
	position: 'relative',
	alignItems: 'center',
	gap: token('space.050'),
	backgroundColor: token('color.background.neutral.subtle'),
	borderRadius: token('radius.small'),
	borderStyle: 'solid',
	borderWidth: token('border.width'),
	color: token('color.text'),
	cursor: 'default',
	marginBlock: token('space.050'),
	marginInline: token('space.050'),
	paddingInline: token('space.050'),
});

const interactiveStyles = css({
	'&:hover': {
		backgroundColor: token('color.background.neutral.subtle.hovered'),
	},
	'&:active': {
		backgroundColor: token('color.background.neutral.subtle.pressed'),
	},
});

const focusRingStyles = css({
	'&:focus-within': {
		outline: `${token('border.width.focused')} solid ${token('color.border.focused')}`,
		outlineOffset: token('space.025'),
	},
});

const BaseTag: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<BaseProps> & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, BaseProps>(function BaseTag(
	{
		before,
		contentElement,
		after,
		testId,
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
	if (color === 'gray') {
		// internally we use 'grey' for gray color so that we can make migration easier behind the ff (gray will work with and without ff now)
		color = 'grey';
	}

	return (
		<span
			{...other}
			ref={ref}
			css={[
				baseStyles,
				isInteractive ? focusRingStyles : undefined,
				isLink && interactiveStyles,
				borderColors[color],
			]}
			style={
				{
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
