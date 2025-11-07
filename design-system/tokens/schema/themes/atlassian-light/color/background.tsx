import type { BackgroundColorTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ValueSchema<BackgroundColorTokenSchema<BaseToken>> = {
	color: {
		blanket: {
			'[default]': { value: 'Neutral500A' },
			// @ts-ignore temporary value (Blue500 8% opacity)
			selected: { value: '#388BFF14' },
			// @ts-ignore temporary value (Red500 8% opacity)
			danger: { value: '#EF5C4814' },
		},
		background: {
			disabled: { value: 'Neutral100A' },
			inverse: {
				subtle: {
					// @ts-ignore temporary value (#000000 16% opacity)
					'[default]': { value: '#00000029' },
					// @ts-ignore temporary value (#000000 24% opacity)
					hovered: { value: '#0000003D' },
					// @ts-ignore temporary value (#000000 32% opacity)
					pressed: { value: '#00000052' },
				},
			},
			input: {
				'[default]': { value: 'Neutral0' },
				hovered: { value: 'Neutral100' },
				pressed: { value: 'Neutral0' },
			},
			neutral: {
				'[default]': {
					'[default]': { value: 'Neutral200A' },
					hovered: { value: 'Neutral300A' },
					pressed: { value: 'Neutral400A' },
				},
				subtle: {
					// @ts-ignore temporary value
					'[default]': { value: 'transparent' },
					hovered: { value: 'Neutral200A' },
					pressed: { value: 'Neutral300A' },
				},
				bold: {
					'[default]': { value: 'Neutral1000' },
					hovered: { value: 'Neutral900' },
					pressed: { value: 'Neutral800' },
				},
			},
			brand: {
				subtlest: {
					'[default]': { value: 'Blue100' },
					hovered: { value: 'Blue200' },
					pressed: { value: 'Blue250' },
				},
				bold: {
					'[default]': { value: 'Blue700' },
					hovered: { value: 'Blue800' },
					pressed: { value: 'Blue850' },
				},
				boldest: {
					'[default]': { value: 'Blue1000' },
					hovered: { value: 'Blue900' },
					pressed: { value: 'Blue850' },
				},
			},
			selected: {
				'[default]': {
					'[default]': { value: 'Blue100' },
					hovered: { value: 'Blue200' },
					pressed: { value: 'Blue300' },
				},
				bold: {
					'[default]': { value: 'Blue700' },
					hovered: { value: 'Blue800' },
					pressed: { value: 'Blue900' },
				},
			},
			danger: {
				'[default]': {
					'[default]': { value: 'Red100' },
					hovered: { value: 'Red200' },
					pressed: { value: 'Red250' },
				},
				bold: {
					'[default]': { value: 'Red700' },
					hovered: { value: 'Red800' },
					pressed: { value: 'Red850' },
				},
			},
			warning: {
				'[default]': {
					'[default]': { value: 'Orange100' },
					hovered: { value: 'Orange200' },
					pressed: { value: 'Orange250' },
				},
				bold: {
					'[default]': { value: 'Orange300' },
					hovered: { value: 'Orange400' },
					pressed: { value: 'Orange500' },
				},
			},
			success: {
				'[default]': {
					'[default]': { value: 'Lime100' },
					hovered: { value: 'Lime200' },
					pressed: { value: 'Lime250' },
				},
				bold: {
					'[default]': { value: 'Lime700' },
					hovered: { value: 'Lime800' },
					pressed: { value: 'Lime850' },
				},
			},
			discovery: {
				'[default]': {
					'[default]': { value: 'Purple100' },
					hovered: { value: 'Purple200' },
					pressed: { value: 'Purple250' },
				},
				bold: {
					'[default]': { value: 'Purple700' },
					hovered: { value: 'Purple800' },
					pressed: { value: 'Purple850' },
				},
			},
			information: {
				'[default]': {
					'[default]': { value: 'Blue100' },
					hovered: { value: 'Blue200' },
					pressed: { value: 'Blue250' },
				},
				bold: {
					'[default]': { value: 'Blue700' },
					hovered: { value: 'Blue800' },
					pressed: { value: 'Blue850' },
				},
			},
		},
	},
};

export default color;
