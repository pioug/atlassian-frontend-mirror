/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, forwardRef } from 'react';

import { css, cssMap, jsx } from '@compiled/react';

import { B200, B300, B400, N30, N40, N50A, N60A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	ref: React.Ref<HTMLInputElement>;
	valuePercent: string;
};

const rangeHeight = 40; // Height of the range input, used for the track and thumb
const trackHeight = 6; // Height of the track, used for the track and thumb
const thumbSize = token('space.200'); // Size of the thumb, used for the thumb styles

// Styles are split up to avoid edge-cases with TS implementations between `css` and `cssMap` with some
// of these edge-case pseudo-selectors.
// Previously, in Emotion, these selectors weren't consolidated, eg. `&::webkit-thumb, &::moz-thumb`
// would not be parsed by either browser, but this may no longer be the case in Compiled
const webkitStyles = css({
	WebkitAppearance: 'none', // Hides the slider so that custom slider can be made
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Required for this browser styling
	'&::-webkit-slider-thumb': {
		boxSizing: 'border-box',
		width: thumbSize,
		height: thumbSize,
		backgroundColor: `var(--thumb-bg, ${token('color.background.neutral.bold', B400)})`,
		border: 'none',
		borderRadius: token('radius.full', '50%'),
		boxShadow: 'var(--thumb-shadow)',
		cursor: 'pointer',
		marginBlockStart: token('space.negative.075', '-6px'),
		outline: 'solid 2px var(--thumb-border)',
		outlineOffset: token('space.025', '2px'),
		transition: 'background-color 0.2s ease-in-out',
		WebkitAppearance: 'none',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Required for this browser styling
	'&::-webkit-slider-runnable-track': {
		width: '100%',
		height: 4,
		backgroundColor: 'var(--track-bg)',
		backgroundImage: 'linear-gradient(var(--track-fg), var(--track-fg))',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'var(--track-fg-width) 100%',
		border: 0,
		borderRadius: 2,
		cursor: 'pointer',
		transition: 'background-color 0.2s ease-in-out',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- May be a false-positive to support RTL
	'&:dir(rtl)::-webkit-slider-runnable-track': {
		backgroundPosition: 'right',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Required for this browser styling
	'&:disabled::-webkit-slider-thumb': {
		cursor: 'not-allowed',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Required for this browser styling
	'&:disabled::-webkit-slider-runnable-track': {
		cursor: 'not-allowed',
	},
});

const firefoxStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Required for this
	'&::-moz-range-thumb': {
		boxSizing: 'border-box',
		width: thumbSize,
		height: thumbSize,
		backgroundColor: `var(--thumb-bg, ${token('color.background.neutral.bold', B400)})`,
		border: 'none',
		borderRadius: token('radius.full', '50%'),
		boxShadow: 'var(--thumb-shadow)',
		cursor: 'pointer',
		outline: 'solid 2px var(--thumb-border)',
		outlineOffset: token('space.025', '2px'),
		transition: 'background-color 0.2s ease-in-out',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Required for this browser styling
	'&::-moz-focus-outer': {
		border: 0,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Required for this browser styling
	'&::-moz-range-progress': {
		width: '100%',
		height: trackHeight,
		backgroundColor: 'var(--track-fg)',
		border: 0,
		borderRadius: 2,
		cursor: 'pointer',
		transition: 'background-color 0.2s ease-in-out',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Required for this browser styling
	'&::-moz-range-track': {
		width: '100%',
		height: 4,
		backgroundColor: 'var(--track-bg)',
		border: 0,
		borderRadius: 2,
		cursor: 'pointer',
		transition: 'background-color 0.2s ease-in-out',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&:disabled::-moz-range-thumb': { cursor: 'not-allowed' },
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Required for this browser styling
	'&:disabled::-moz-range-progress': { cursor: 'not-allowed' },
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Required for this browser styling
	'&:disabled::-moz-range-track': { cursor: 'not-allowed' },
});

const baseStyles = css({
	width: '100%', // Input should fill the wrapper
	height: rangeHeight, // Otherwise thumb will collide with previous box element
	backgroundColor: 'transparent', // Otherwise white
	'&:focus': {
		outline: 'none',
	},
	'&:disabled': {
		cursor: 'not-allowed',
		opacity: token('opacity.disabled', '0.4'),
	},
});

const themeStyles = css({
	'--thumb-shadow': token('utility.UNSAFE.transparent', `0 4px 8px -2px ${N50A}, 0 0 1px ${N60A}`),
	'--track-bg': token('color.background.neutral', N30),
	'--track-fg': token('color.background.neutral.bold', B400),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Required for this browser styling
	'&:hover:not(:disabled)': {
		'--thumb-bg': token('color.background.neutral.bold.hovered', B300),
		'--track-bg': token('color.background.neutral.hovered', N40),
		'--track-fg': token('color.background.neutral.bold.hovered', B300),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Required for this browser styling
	'&:active:not(:disabled)': {
		'--thumb-bg': token('color.background.neutral.bold.pressed', B200),
	},
	'&:focus-visible': {
		'--thumb-border': token('color.border.focused', B200),
	},
});

const trackStyles = cssMap({
	root: {
		width: '100%',
		height: rangeHeight,
		position: 'relative',
		'&::after': {
			display: 'block',
			width: '4px',
			height: '4px',
			position: 'absolute',
			backgroundColor: token('color.background.neutral.bold.pressed'),
			borderRadius: token('radius.full', '50%'),
			content: '',
			insetBlockStart: '50%',
			insetInlineStart: 'calc(100% - 3px)',
		},
	},
	disabled: {
		'&::after': {
			opacity: token('opacity.disabled', '0.4'),
		},
	},
});

const rangeA11yStyles = css({
	'--thumb-bg': token('color.background.neutral.bold.pressed'),
	'--track-bg': token('color.background.inverse.subtle'),
	'--track-fg': token('color.background.neutral.bold.pressed'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&::-webkit-slider-thumb': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		marginBlockStart: '-5px',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&::-webkit-slider-runnable-track': {
		height: trackHeight,
		borderRadius: 3,
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&::-moz-range-progress': {
		height: trackHeight,
		borderRadius: 3,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&:hover:not(:disabled)': {
		'--track-bg': token('color.background.inverse.subtle.hovered'),
	},
});

/**
 * __Input__
 * Internal-only styled input component.
 */
export const Input = forwardRef((props: InputProps, ref: React.Ref<HTMLInputElement>) => {
	const { valuePercent, style, ...strippedProps } = props;

	const input = (
		// eslint-disable-next-line @atlaskit/design-system/no-html-text-input
		<input
			{...strippedProps}
			style={
				{
					// We are creating a css variable to control the "progress" portion of the range input
					// This avoids us needing to create a new css class for each new percentage value
					'--track-fg-width': `${valuePercent}%`,
				} as CSSProperties
			}
			ref={ref}
			css={[baseStyles, webkitStyles, firefoxStyles, themeStyles, rangeA11yStyles]}
		/>
	);

	return (
		<div css={[trackStyles.root, strippedProps.disabled && trackStyles.disabled]}>{input}</div>
	);
});

Input.displayName = 'InputRange';
