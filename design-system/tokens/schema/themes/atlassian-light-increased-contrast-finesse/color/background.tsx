import type { BackgroundColorTokenSchema, DeepPartial, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ValueSchema<DeepPartial<BackgroundColorTokenSchema<BaseToken>>> = {
	color: {
		blanket: {
			selected: { value: 'Neutral200A' },
		},
		background: {
			neutral: {
				subtle: {
					hovered: { value: 'Neutral100A' },
					pressed: { value: 'Neutral200A' },
				},
			},
			selected: {
				'[default]': {
					'[default]': { value: 'Neutral200A' },
					hovered: { value: 'Neutral300A' },
					pressed: { value: 'Neutral400A' },
				},
				bold: {
					'[default]': { value: 'Neutral1000' },
					hovered: { value: 'Neutral900' },
					pressed: { value: 'Neutral800' },
				},
			},
		},
	},
};

export default color;
