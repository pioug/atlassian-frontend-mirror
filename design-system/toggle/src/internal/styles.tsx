/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';

import { fg } from '@atlaskit/platform-feature-flags';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { type Size } from '../types';

import { getColors } from './colors';

type Dimensions = 'width' | 'height';
type DimensionsObject = { [key in Size]: { [key in Dimensions]: number } };

const globalGridSize = gridSize();

const dimensions: DimensionsObject = {
	regular: {
		height: globalGridSize * 2,
		width: globalGridSize * 4,
	},
	large: {
		height: globalGridSize * 2 + globalGridSize / 2,
		width: globalGridSize * 5,
	},
};

const getHeight = ({ size }: { size: Size }) => dimensions[size].height;
const getWidth = ({ size }: { size: Size }) => dimensions[size].width;

const borderWidth = 2;
const paddingUnitless = globalGridSize / 4;
const transition = 'transform 0.2s ease';

export const getStyles = (size: Size): SerializedStyles => {
	const colors = getColors();

	// TODO: Use tokens and reorganize to alphasemantic ordering (DSP-11769 DSP-11770)
	/* eslint-disable @atlaskit/design-system/ensure-design-token-usage/preview,@repo/internal/styles/consistent-style-ordering */
	return css({
		boxSizing: 'content-box',
		display: 'inline-block',
		padding: borderWidth,
		margin: borderWidth,
		backgroundClip: 'content-box',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		backgroundColor: colors.backgroundColorUnchecked,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		borderRadius: `${getHeight({ size })}px`,
		border: `${borderWidth}px solid transparent`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		height: `${getHeight({ size })}px`,
		position: 'relative',
		transition: `${transition}`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		width: `${getWidth({ size })}px`,

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&[data-checked]': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			backgroundColor: colors.backgroundColorChecked,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			color: colors.iconColorChecked,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&[data-disabled]:not([data-checked])': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			backgroundColor: colors.backgroundColorUncheckedDisabled,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&[data-disabled][data-checked],&[data-disabled][data-checked]:hover': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			backgroundColor: colors.backgroundColorCheckedDisabled,
		},

		'&:focus-within': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			border: `${borderWidth}px solid ${colors.borderColorFocus}`,
		},

		'&:hover': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			backgroundColor: colors.backgroundColorUncheckedHover,
			cursor: 'pointer',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&[data-disabled]:hover,&[data-disabled][data-checked]:hover,&[data-disabled]:not([data-checked]):hover':
			{
				cursor: 'not-allowed',
			},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&[data-checked]:hover': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			backgroundColor: colors.backgroundColorCheckedHover,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&:not([data-checked]):hover': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			backgroundColor: colors.backgroundColorUncheckedHover,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&[data-disabled]:not([data-checked]):hover': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			backgroundColor: colors.backgroundColorCheckedDisabled,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		color: colors.iconColorUnchecked,

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&[data-disabled], &[data-disabled][data-checked], &[data-disabled][data-checked]:hover': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			color: colors.iconColorDisabled,
		},

		// the input element underneath
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'input[type="checkbox"]': {
			opacity: 0,
			margin: 0,
			padding: 0,
			border: 'none',

			'&:focus': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
				outline: 'none !important',
			},
		},

		// slider
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'::before': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			backgroundColor: colors.handleBackgroundColor,
			borderRadius: token('border.radius.circle', '50%'),
			content: '""',
			position: 'absolute',
			transform: 'initial',
			transition: transition,

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			insetBlockEnd: `${2 * paddingUnitless}px`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			height: `${getHeight({ size }) - paddingUnitless * 2}px`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			width: `${getHeight({ size }) - paddingUnitless * 2}px`,

			// initially we set left as left-most position
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			insetInlineStart: `${2 * paddingUnitless}px`,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&[data-checked]::before': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			backgroundColor: colors.handleBackgroundColorChecked,

			// when  it's checked, slide the pseudo-element to right-most postion
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			transform: `translateX(${getHeight({ size })}px)`,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&[data-disabled]::before': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			backgroundColor: colors.handleBackgroundColorDisabled,
			zIndex: 1,
		},

		// Remove during new icon flag cleanup. This is required to maintain the size of legacy icons.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		...(size === 'large' &&
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			!fg('platform-visual-refresh-icons') && {
				'> span > span': {
					height: '20px',
					width: '20px',
				},
			}),

		'@media screen and (forced-colors: active)': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'::before': {
				filter: 'grayscale(100%) invert(1)',
			},
			'&:focus-within': {
				outline: '1px solid',
			},
		},
	});
};
