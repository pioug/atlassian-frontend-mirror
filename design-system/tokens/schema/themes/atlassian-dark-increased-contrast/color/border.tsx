import type { BorderColorTokenSchema, ExtendedValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ExtendedValueSchema<BorderColorTokenSchema<BaseToken>> = {
	color: {
		border: {
			'[default]': {
				value: 'DarkNeutral500A',
			},
			bold: {
				value: 'DarkNeutral800',
			},
			input: {
				value: 'DarkNeutral800',
			},
			disabled: {
				value: 'DarkNeutral300A',
			},
			brand: {
				value: 'Blue300',
			},
			selected: {
				value: 'Blue300',
			},
			danger: {
				'[default]': {
					value: 'Red400',
				},
			},
			warning: {
				'[default]': {
					value: 'Orange300',
				},
			},
			success: {
				'[default]': {
					value: 'Green300',
				},
			},
			discovery: {
				'[default]': {
					value: 'Purple400',
				},
			},
			information: {
				'[default]': {
					value: 'Blue300',
				},
			},
		},
	},
};

export default color;
