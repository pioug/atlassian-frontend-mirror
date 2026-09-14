import type { BackgroundColorTokenSchema, DeepPartial, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ValueSchema<DeepPartial<BackgroundColorTokenSchema<BaseToken>>> = {
	color: {
		blanket: {
			selected: { value: 'DarkNeutral200A' },
		},
		background: {
			neutral: {
				subtle: {
					hovered: { value: 'DarkNeutral100A' },
					pressed: { value: 'DarkNeutral200A' },
				},
			},
			selected: {
				'[default]': {
					'[default]': { value: 'DarkNeutral200A' },
					hovered: { value: 'DarkNeutral300A' },
					pressed: { value: 'DarkNeutral400A' },
				},
				bold: {
					'[default]': { value: 'DarkNeutral1000' },
					hovered: { value: 'DarkNeutral900' },
					pressed: { value: 'DarkNeutral1100' },
				},
			},
		},
	},
};

export default color;
