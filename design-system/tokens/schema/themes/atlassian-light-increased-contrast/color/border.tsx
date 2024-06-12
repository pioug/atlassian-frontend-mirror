import type { BorderColorTokenSchema, ExtendedValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ExtendedValueSchema<BorderColorTokenSchema<BaseToken>> = {
	color: {
		border: {
			'[default]': {
				// TODO: Confirm. Not sure we're meant to use Dark Neutral pallette in light themes but might be fine
				value: 'DarkNeutral500A',
			},
			bold: {
				value: 'Neutral800',
			},
			focused: {
				value: 'Blue800',
			},
			input: {
				value: 'Neutral800',
			},
			disabled: {
				value: 'Neutral300A',
			},
			brand: {
				value: 'Blue800',
			},
			selected: {
				value: 'Blue800',
			},
			danger: {
				value: 'Red700',
			},
			warning: {
				value: 'Orange800',
			},
			success: {
				value: 'Green800',
			},
			discovery: {
				value: 'Purple700',
			},
			information: {
				value: 'Blue800',
			},
		},
	},
};

export default color;
