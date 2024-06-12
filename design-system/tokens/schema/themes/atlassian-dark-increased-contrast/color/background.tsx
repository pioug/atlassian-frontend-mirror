import type { BackgroundColorTokenSchema, ExtendedValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ExtendedValueSchema<BackgroundColorTokenSchema<BaseToken>> = {
	color: {
		background: {
			brand: {
				bold: {
					'[default]': { value: 'Blue200' },
					hovered: { value: 'Blue100' },
					pressed: { value: 'DarkNeutral1100' },
				},
			},
			selected: {
				bold: {
					'[default]': { value: 'Blue200' },
					hovered: { value: 'Blue100' },
					pressed: { value: 'DarkNeutral1100' },
				},
			},
			danger: {
				bold: {
					'[default]': { value: 'Red200' },
					hovered: { value: 'Red100' },
					pressed: { value: 'DarkNeutral1100' },
				},
			},
			warning: {
				bold: {
					'[default]': { value: 'Yellow200' },
					hovered: { value: 'Yellow100' },
					pressed: { value: 'DarkNeutral1100' },
				},
			},
			success: {
				bold: {
					'[default]': { value: 'Green200' },
					hovered: { value: 'Green100' },
					pressed: { value: 'DarkNeutral1100' },
				},
			},
			discovery: {
				bold: {
					'[default]': { value: 'Purple200' },
					hovered: { value: 'Purple100' },
					pressed: { value: 'DarkNeutral1100' },
				},
			},
			information: {
				bold: {
					'[default]': { value: 'Blue200' },
					hovered: { value: 'Blue100' },
					pressed: { value: 'DarkNeutral1100' },
				},
			},
		},
	},
};

export default color;
