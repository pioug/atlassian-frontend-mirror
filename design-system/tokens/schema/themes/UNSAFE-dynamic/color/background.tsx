import type { BackgroundColorTokenSchema, ExtendedValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';
import { dynamicColor } from '../_formulas';

/**
 * Partial: tokens not overridden here (e.g. the status `subtler` and `subtle` variants) come from
 * the base theme this theme extends.
 */
const color: ExtendedValueSchema<BackgroundColorTokenSchema<BaseToken>> = {
	color: {
		// TODO work out what happens to blankets
		blanket: {
			'[default]': { value: 'Neutral500A' },
			// @ts-ignore temporary value (Blue500 8% opacity)
			selected: { value: 'Neutral500A' },
			// @ts-ignore temporary value (Red500 8% opacity)
			danger: { value: 'Neutral500A' },
		},
		background: {
			disabled: { value: dynamicColor.disabled },
			inverse: {
				subtle: {
					// @ts-ignore temporary value (#000000 16% opacity)
					'[default]': { value: dynamicColor.foreground },
					// @ts-ignore temporary value (#000000 24% opacity)
					hovered: { value: dynamicColor.foregroundHovered },
					// @ts-ignore temporary value (#000000 32% opacity)
					pressed: { value: dynamicColor.foregroundPressed },
				},
			},
			input: {
				'[default]': { value: dynamicColor.background },
				hovered: { value: dynamicColor.backgroundHovered },
				pressed: { value: dynamicColor.backgroundPressed },
			},
			neutral: {
				'[default]': {
					'[default]': { value: dynamicColor.background },
					hovered: { value: dynamicColor.backgroundHovered },
					pressed: { value: dynamicColor.backgroundPressed },
				},
				subtle: {
					'[default]': { value: dynamicColor.background },
					hovered: { value: dynamicColor.backgroundHovered },
					pressed: { value: dynamicColor.backgroundPressed },
				},
				bold: {
					'[default]': { value: dynamicColor.foreground },
					hovered: { value: dynamicColor.foregroundHovered },
					pressed: { value: dynamicColor.foregroundPressed },
				},
			},
			brand: {
				subtlest: {
					'[default]': { value: dynamicColor.backgroundSubtle },
					hovered: { value: dynamicColor.backgroundSubtleHovered },
					pressed: { value: dynamicColor.backgroundSubtlePressed },
				},
				bold: {
					'[default]': { value: dynamicColor.foreground },
					hovered: { value: dynamicColor.foregroundHovered },
					pressed: { value: dynamicColor.foregroundPressed },
				},
				boldest: {
					'[default]': { value: dynamicColor.foreground },
					hovered: { value: dynamicColor.foregroundHovered },
					pressed: { value: dynamicColor.foregroundPressed },
				},
			},
			selected: {
				'[default]': {
					'[default]': { value: dynamicColor.backgroundSubtle },
					hovered: { value: dynamicColor.backgroundSubtleHovered },
					pressed: { value: dynamicColor.backgroundSubtlePressed },
				},
				bold: {
					'[default]': { value: dynamicColor.foreground },
					hovered: { value: dynamicColor.foregroundHovered },
					pressed: { value: dynamicColor.foregroundPressed },
				},
			},
			danger: {
				'[default]': {
					'[default]': { value: dynamicColor.backgroundSubtle },
					hovered: { value: dynamicColor.backgroundSubtleHovered },
					pressed: { value: dynamicColor.backgroundSubtlePressed },
				},
				bold: {
					'[default]': { value: dynamicColor.foreground },
					hovered: { value: dynamicColor.foregroundHovered },
					pressed: { value: dynamicColor.foregroundPressed },
				},
			},
			warning: {
				'[default]': {
					'[default]': { value: dynamicColor.backgroundSubtle },
					hovered: { value: dynamicColor.backgroundSubtleHovered },
					pressed: { value: dynamicColor.backgroundSubtlePressed },
				},
				bold: {
					'[default]': { value: dynamicColor.foreground },
					hovered: { value: dynamicColor.foregroundHovered },
					pressed: { value: dynamicColor.foregroundPressed },
				},
			},
			success: {
				'[default]': {
					'[default]': { value: dynamicColor.backgroundSubtle },
					hovered: { value: dynamicColor.backgroundSubtleHovered },
					pressed: { value: dynamicColor.backgroundSubtlePressed },
				},
				bold: {
					'[default]': { value: dynamicColor.foreground },
					hovered: { value: dynamicColor.foregroundHovered },
					pressed: { value: dynamicColor.foregroundPressed },
				},
			},
			discovery: {
				'[default]': {
					'[default]': { value: dynamicColor.backgroundSubtle },
					hovered: { value: dynamicColor.backgroundSubtleHovered },
					pressed: { value: dynamicColor.backgroundSubtlePressed },
				},
				bold: {
					'[default]': { value: dynamicColor.foreground },
					hovered: { value: dynamicColor.foregroundHovered },
					pressed: { value: dynamicColor.foregroundPressed },
				},
			},
			information: {
				'[default]': {
					'[default]': { value: dynamicColor.backgroundSubtle },
					hovered: { value: dynamicColor.backgroundSubtleHovered },
					pressed: { value: dynamicColor.backgroundSubtlePressed },
				},
				bold: {
					'[default]': { value: dynamicColor.foreground },
					hovered: { value: dynamicColor.foregroundHovered },
					pressed: { value: dynamicColor.foregroundPressed },
				},
			},
		},
	},
};

export default color;
