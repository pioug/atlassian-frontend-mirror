import type { ChartColorTokenSchema, ExtendedValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ExtendedValueSchema<ChartColorTokenSchema<BaseToken>> = {
	color: {
		chart: {
			brand: {
				'[default]': {
					value: 'Blue400',
				},
				hovered: {
					value: 'Blue300',
				},
			},
			neutral: {
				'[default]': {
					value: 'DarkNeutral700',
				},
				hovered: {
					value: 'DarkNeutral800',
				},
			},
			danger: {
				'[default]': {
					'[default]': {
						value: 'Red400',
					},
				},
			},
			information: {
				'[default]': {
					'[default]': {
						value: 'Blue400',
					},
				},
			},
			discovery: {
				'[default]': {
					'[default]': {
						value: 'Purple400',
					},
				},
			},
			categorical: {
				1: {
					'[default]': {
						value: 'Teal300',
					},
					hovered: {
						value: 'Teal200',
					},
				},
				3: {
					'[default]': {
						value: 'Orange300',
					},
					hovered: {
						value: 'Orange200',
					},
				},

				6: {
					'[default]': {
						value: 'Purple300',
					},
					hovered: {
						value: 'Purple200',
					},
				},
			},
			blue: {
				bold: {
					'[default]': {
						value: 'Blue300',
					},
					hovered: {
						value: 'Blue200',
					},
				},
				bolder: {
					'[default]': {
						value: 'Blue200',
					},
					hovered: {
						value: 'Blue100',
					},
				},
				boldest: {
					'[default]': {
						value: 'Blue100',
					},
				},
			},
			red: {
				bold: {
					'[default]': {
						value: 'Red300',
					},
					hovered: {
						value: 'Red200',
					},
				},
				bolder: {
					'[default]': {
						value: 'Red200',
					},
					hovered: {
						value: 'Red100',
					},
				},
				boldest: {
					'[default]': {
						value: 'Red100',
					},
					hovered: {
						value: 'Red200',
					},
				},
			},
			orange: {
				bold: {
					'[default]': {
						value: 'Orange300',
					},
					hovered: {
						value: 'Orange200',
					},
				},
				bolder: {
					'[default]': {
						value: 'Orange200',
					},
					hovered: {
						value: 'Orange100',
					},
				},
				boldest: {
					'[default]': {
						value: 'Orange100',
					},
				},
			},
			yellow: {
				bold: {
					'[default]': {
						value: 'Yellow300',
					},
					hovered: {
						value: 'Yellow200',
					},
				},
				bolder: {
					'[default]': {
						value: 'Yellow200',
					},
					hovered: {
						value: 'Yellow100',
					},
				},
				boldest: {
					'[default]': {
						value: 'Yellow100',
					},
				},
			},
			green: {
				bold: {
					'[default]': {
						value: 'Green300',
					},
				},
				bolder: {
					'[default]': {
						value: 'Green200',
					},
					hovered: {
						value: 'Green100',
					},
				},
				boldest: {
					'[default]': {
						value: 'Green100',
					},
				},
			},
			teal: {
				bold: {
					'[default]': {
						value: 'Teal300',
					},
					hovered: {
						value: 'Teal200',
					},
				},
				bolder: {
					'[default]': {
						value: 'Teal200',
					},
					hovered: {
						value: 'Teal100',
					},
				},
				boldest: {
					'[default]': {
						value: 'Teal100',
					},
				},
			},
			purple: {
				bold: {
					'[default]': {
						value: 'Purple300',
					},
					hovered: {
						value: 'Purple200',
					},
				},
				bolder: {
					'[default]': {
						value: 'Purple200',
					},
					hovered: {
						value: 'Purple100',
					},
				},
				boldest: {
					'[default]': {
						value: 'Purple100',
					},
				},
			},
			magenta: {
				bold: {
					'[default]': {
						value: 'Magenta300',
					},
					hovered: {
						value: 'Magenta200',
					},
				},
				bolder: {
					'[default]': {
						value: 'Magenta200',
					},
					hovered: {
						value: 'Magenta100',
					},
				},
				boldest: {
					'[default]': {
						value: 'Magenta100',
					},
				},
			},
			lime: {
				bold: {
					'[default]': {
						value: 'Lime300',
					},
					hovered: {
						value: 'Lime200',
					},
				},
				bolder: {
					'[default]': {
						value: 'Lime200',
					},
					hovered: {
						value: 'Lime100',
					},
				},
				boldest: {
					'[default]': {
						value: 'Lime100',
					},
				},
			},
			gray: {
				bold: {
					'[default]': {
						value: 'DarkNeutral700',
					},
					hovered: {
						value: 'DarkNeutral800',
					},
				},
				bolder: {
					'[default]': {
						value: 'DarkNeutral800',
					},
					hovered: {
						value: 'DarkNeutral900',
					},
				},
				boldest: {
					'[default]': {
						value: 'DarkNeutral900',
					},
					hovered: {
						value: 'DarkNeutral1000',
					},
				},
			},
		},
	},
};

export default color;
