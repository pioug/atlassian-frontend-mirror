import type { BackgroundColorTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ValueSchema<BackgroundColorTokenSchema<BaseToken>> = {
	color: {
		blanket: {
			// @ts-ignore temporary value (DarkNeutral-100 60% opacity)
			'[default]': { value: '#10121499' },
			// @ts-ignore temporary value (Blue600 8% opacity)
			selected: { value: '#1D7AFC14' },
			// @ts-ignore temporary value (Red600 8% opacity)
			danger: { value: '#E3493514' },
		},
		background: {
			disabled: { value: 'DarkNeutral100A' },
			inverse: {
				subtle: {
					// @ts-ignore temporary value (#FFFFFF 16% opacity)
					'[default]': { value: '#FFFFFF29' },
					// @ts-ignore temporary value (#FFFFFF 24% opacity)
					hovered: { value: '#FFFFFF3D' },
					// @ts-ignore temporary value (#FFFFFF 32% opacity)
					pressed: { value: '#FFFFFF52' },
				},
			},
			input: {
				'[default]': { value: 'DarkNeutral200' },
				hovered: { value: 'DarkNeutral250' },
				pressed: { value: 'DarkNeutral200' },
			},
			neutral: {
				'[default]': {
					'[default]': { value: 'DarkNeutral200A' },
					hovered: { value: 'DarkNeutral300A' },
					pressed: { value: 'DarkNeutral400A' },
				},
				subtle: {
					// @ts-ignore temporary value
					'[default]': { value: 'transparent' },
					hovered: { value: 'DarkNeutral200A' },
					pressed: { value: 'DarkNeutral300A' },
				},
				bold: {
					'[default]': { value: 'DarkNeutral800' },
					hovered: { value: 'DarkNeutral900' },
					pressed: { value: 'DarkNeutral1000' },
				},
			},
			brand: {
				subtlest: {
					'[default]': { value: 'Blue1000' },
					hovered: { value: 'Blue900' },
					pressed: { value: 'Blue800' },
				},
				bold: {
					'[default]': { value: 'Blue400' },
					hovered: { value: 'Blue300' },
					pressed: { value: 'Blue200' },
				},
				boldest: {
					'[default]': { value: 'Blue100' },
					hovered: { value: 'Blue200' },
					pressed: { value: 'Blue300' },
				},
			},
			selected: {
				'[default]': {
					'[default]': { value: 'Blue1000' },
					hovered: { value: 'Blue900' },
					pressed: { value: 'Blue800' },
				},
				bold: {
					'[default]': { value: 'Blue400' },
					hovered: { value: 'Blue300' },
					pressed: { value: 'Blue200' },
				},
			},
			danger: {
				'[default]': {
					'[default]': { value: 'Red1000' },
					hovered: { value: 'Red900' },
					pressed: { value: 'Red800' },
				},
				bold: {
					'[default]': { value: 'Red400' },
					hovered: { value: 'Red300' },
					pressed: { value: 'Red200' },
				},
			},
			warning: {
				'[default]': {
					'[default]': { value: 'Yellow1000' },
					hovered: { value: 'Yellow900' },
					pressed: { value: 'Yellow800' },
				},
				bold: {
					'[default]': { value: 'Yellow300' },
					hovered: { value: 'Yellow400' },
					pressed: { value: 'Yellow500' },
				},
			},
			success: {
				'[default]': {
					'[default]': { value: 'Green1000' },
					hovered: { value: 'Green900' },
					pressed: { value: 'Green800' },
				},
				bold: {
					'[default]': { value: 'Green400' },
					hovered: { value: 'Green300' },
					pressed: { value: 'Green200' },
				},
			},
			discovery: {
				'[default]': {
					'[default]': { value: 'Purple1000' },
					hovered: { value: 'Purple900' },
					pressed: { value: 'Purple800' },
				},
				bold: {
					'[default]': { value: 'Purple400' },
					hovered: { value: 'Purple300' },
					pressed: { value: 'Purple200' },
				},
			},
			information: {
				'[default]': {
					'[default]': { value: 'Blue1000' },
					hovered: { value: 'Blue900' },
					pressed: { value: 'Blue800' },
				},
				bold: {
					'[default]': { value: 'Blue400' },
					hovered: { value: 'Blue300' },
					pressed: { value: 'Blue200' },
				},
			},
		},
	},
};

export default color;
