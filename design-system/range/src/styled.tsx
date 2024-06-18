/**
 * @jsxRuntime classic
 */
/** @jsx jsx */

import { type CSSProperties, forwardRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import * as theme from './theme';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	ref: React.Ref<HTMLInputElement>;
	valuePercent: string;
};

const VAR_THUMB_BORDER_COLOR = '--thumb-border';
const VAR_THUMB_SHADOW = '--thumb-shadow';
const VAR_THUMB_BACKGROUND_COLOR = '--thumb-bg';
const VAR_TRACK_BACKGROUND_COLOR = '--track-bg';
const VAR_TRACK_FOREGROUND_COLOR = '--track-fg';
const VAR_TRACK_FOREGROUND_WIDTH = '--track-fg-width';

const sliderThumbStyles = {
	boxSizing: 'border-box',
	width: theme.thumb.size,
	height: theme.thumb.size,
	border: 'none',
	background: `var(${VAR_THUMB_BACKGROUND_COLOR}, ${theme.thumb.background.default})`,
	// adapted from @atlaskit/focus-ring
	outline: `solid 2px var(${VAR_THUMB_BORDER_COLOR})`,
	outlineOffset: '2px',
	borderRadius: token('border.radius.circle', '50%'),
	boxShadow: `var(${VAR_THUMB_SHADOW})`,
	cursor: 'pointer', // Different implicit behavior across browsers -> making it explicit.
	transition: `background-color ${theme.transitionDuration} ease-in-out`,
} as const;

const sliderTrackStyles = {
	borderRadius: theme.track.borderRadius,
	border: 0,
	cursor: 'pointer',
	height: theme.track.height,
	width: '100%',
	transition: `background-color ${theme.transitionDuration} ease-in-out`,
} as const;

// Styles are split per browser as they are implemented differently
// Cannot consolidate as Chrome & Firefox don't recognise styles if they are grouped
// with CSS selectors they don't recognise, e.g. &::-ms-thumb
const browserStyles = {
	webkit: css({
		WebkitAppearance: 'none', // Hides the slider so that custom slider can be made
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'::-webkit-slider-thumb': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			...sliderThumbStyles,
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			marginBlockStart: -(theme.thumb.size - theme.track.height) / 2,
			WebkitAppearance: 'none',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'::-webkit-slider-runnable-track': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			...sliderTrackStyles,
			/**
			 * Webkit does not have separate properties for the background/foreground like firefox.
			 * Instead we use background layering:
			 * - The gray background is a simple background color.
			 * - The blue foreground is a 'gradient' (to create a color block) that is sized to the progress.
			 *
			 * Individual properties have been used over the `background` shorthand for readability.
			 */
			backgroundColor: `var(${VAR_TRACK_BACKGROUND_COLOR})`,
			backgroundImage: `linear-gradient(var(${VAR_TRACK_FOREGROUND_COLOR}), var(${VAR_TRACK_FOREGROUND_COLOR}))`,
			backgroundRepeat: 'no-repeat',
			backgroundSize: `var(${VAR_TRACK_FOREGROUND_WIDTH}) 100%`,
			// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'[dir="rtl"] &': {
				backgroundPosition: 'right',
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		':disabled': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'::-webkit-slider-thumb, ::-webkit-slider-runnable-track': {
				cursor: 'not-allowed',
			},
		},
	}),
	firefox: css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		'::-moz-range-thumb': sliderThumbStyles,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'::-moz-focus-outer': {
			border: 0,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'::-moz-range-progress': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			...sliderTrackStyles,
			background: `var(${VAR_TRACK_FOREGROUND_COLOR})`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'::-moz-range-track': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			...sliderTrackStyles,
			background: `var(${VAR_TRACK_BACKGROUND_COLOR})`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		':disabled': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'::-moz-range-thumb, ::-moz-range-progress, ::-moz-range-track': {
				cursor: 'not-allowed',
			},
		},
	}),
};

const baseStyles = css({
	width: '100%', // Has a fixed width by default
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	height: theme.input.height, // Otherwise thumb will collide with previous box element
	background: 'transparent', // Otherwise white
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':focus': {
		outline: 'none',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':disabled': {
		cursor: 'not-allowed',
		opacity: token('opacity.disabled', '0.4'),
	},
});

const themeStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[VAR_THUMB_SHADOW]: theme.thumb.boxShadow.default,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[VAR_TRACK_BACKGROUND_COLOR]: theme.track.background.default,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[VAR_TRACK_FOREGROUND_COLOR]: theme.track.foreground.default,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':hover:not(:disabled)': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		[VAR_THUMB_BACKGROUND_COLOR]: theme.thumb.background.hovered,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		[VAR_TRACK_BACKGROUND_COLOR]: theme.track.background.hovered,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		[VAR_TRACK_FOREGROUND_COLOR]: theme.track.foreground.hovered,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':active:not(:disabled)': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		[VAR_THUMB_BACKGROUND_COLOR]: theme.thumb.background.pressed,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':focus-visible': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		[VAR_THUMB_BORDER_COLOR]: theme.thumb.borderColor.focused,
	},
});

/**
 * __Input__
 * Internal-only styled input component.
 */
export const Input = forwardRef((props: InputProps, ref: React.Ref<HTMLInputElement>) => {
	const { valuePercent, style, ...strippedProps } = props;

	return (
		<input
			{...strippedProps}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={
				{
					// We are creating a css variable to control the "progress" portion of the range input
					// This avoids us needing to create a new css class for each new percentage value
					[VAR_TRACK_FOREGROUND_WIDTH]: `${valuePercent}%`,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				} as CSSProperties
			}
			ref={ref}
			css={[baseStyles, browserStyles.webkit, browserStyles.firefox, themeStyles]}
		/>
	);
});

Input.displayName = 'InputRange';
