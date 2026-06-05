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
				'[default]': {
					value: 'Red700',
				},
			},
			warning: {
				'[default]': {
					value: 'Orange800',
				},
			},
			success: {
				'[default]': {
					value: 'Green800',
				},
			},
			discovery: {
				'[default]': {
					value: 'Purple700',
				},
			},
			information: {
				'[default]': {
					value: 'Blue800',
				},
			},
		},
	},
};

export default color;
