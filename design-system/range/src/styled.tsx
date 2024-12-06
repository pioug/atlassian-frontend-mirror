/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type CSSProperties, forwardRef } from 'react';

import { css, jsx } from '@compiled/react';

import { B200, B300, B400, N30, N40, N50A, N60A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	ref: React.Ref<HTMLInputElement>;
	valuePercent: string;
};

const sliderThumbStyles = {
	boxSizing: 'border-box',
	width: 16,
	height: 16,
	border: 'none',
	background: `var(--thumb-bg, ${token('color.background.neutral.bold', B400)})`,
	// adapted from @atlaskit/focus-ring
	outline: 'solid 2px var(--thumb-border)',
	outlineOffset: '2px',
	borderRadius: token('border.radius.circle', '50%'),
	boxShadow: 'var(--thumb-shadow)',
	cursor: 'pointer', // Different implicit behavior across browsers -> making it explicit.
	transition: 'background-color 0.2s ease-in-out',
} as const;

const sliderTrackStyles = {
	borderRadius: 2,
	border: 0,
	cursor: 'pointer',
	height: 4,
	width: '100%',
	transition: 'background-color 0.2s ease-in-out',
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
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/use-tokens-space -- Ignored via go/DSP-18766
			marginBlockStart: '-6px',
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
			backgroundColor: 'var(--track-bg)',
			backgroundImage: 'linear-gradient(var(--track-fg), var(--track-fg))',
			backgroundRepeat: 'no-repeat',
			backgroundSize: 'var(--track-fg-width) 100%',
			// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'[dir="rtl"] &': {
				backgroundPosition: 'right',
			},
		},
		'&:disabled': {
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
			background: 'var(--track-fg)',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'::-moz-range-track': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			...sliderTrackStyles,
			background: 'var(--track-bg)',
		},
		'&:disabled': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'::-moz-range-thumb, ::-moz-range-progress, ::-moz-range-track': {
				cursor: 'not-allowed',
			},
		},
	}),
};

const baseStyles = css({
	width: '100%', // Has a fixed width by default
	height: 40, // Otherwise thumb will collide with previous box element
	background: 'transparent', // Otherwise white
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
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':hover:not(:disabled)': {
		'--thumb-bg': token('color.background.neutral.bold.hovered', B300),
		'--track-bg': token('color.background.neutral.hovered', N40),
		'--track-fg': token('color.background.neutral.bold.hovered', B300),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':active:not(:disabled)': {
		'--thumb-bg': token('color.background.neutral.bold.pressed', B200),
	},
	'&:focus-visible': {
		'--thumb-border': token('color.border.focused', B200),
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
			style={
				{
					// We are creating a css variable to control the "progress" portion of the range input
					// This avoids us needing to create a new css class for each new percentage value
					'--track-fg-width': `${valuePercent}%`,
				} as CSSProperties
			}
			ref={ref}
			css={[baseStyles, browserStyles.webkit, browserStyles.firefox, themeStyles]}
		/>
	);
});

Input.displayName = 'InputRange';
