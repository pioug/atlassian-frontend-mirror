import type { ChartColorTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ValueSchema<ChartColorTokenSchema<BaseToken>> = {
	color: {
		chart: {
			brand: {
				'[default]': {
					value: 'Blue500',
				},
				hovered: {
					value: 'Blue400',
				},
			},
			neutral: {
				'[default]': {
					value: 'DarkNeutral600',
				},
				hovered: {
					value: 'DarkNeutral700',
				},
			},
			success: {
				'[default]': {
					'[default]': {
						value: 'Lime500',
					},
					hovered: {
						value: 'Lime400',
					},
				},
				bold: {
					'[default]': {
						value: 'Lime300',
					},
					hovered: {
						value: 'Lime200',
					},
				},
			},
			danger: {
				'[default]': {
					'[default]': {
						value: 'Red600',
					},
					hovered: {
						value: 'Red500',
					},
				},
				bold: {
					'[default]': {
						value: 'Red250',
					},
					hovered: {
						value: 'Red300',
					},
				},
			},
			warning: {
				'[default]': {
					'[default]': {
						value: 'Orange500',
					},
					hovered: {
						value: 'Orange400',
					},
				},
				bold: {
					'[default]': {
						value: 'Orange300',
					},
					hovered: {
						value: 'Orange200',
					},
				},
			},
			information: {
				'[default]': {
					'[default]': {
						value: 'Blue500',
					},
					hovered: {
						value: 'Blue400',
					},
				},
				bold: {
					'[default]': {
						value: 'Blue300',
					},
					hovered: {
						value: 'Blue200',
					},
				},
			},
			discovery: {
				'[default]': {
					'[default]': {
						value: 'Purple500',
					},
					hovered: {
						value: 'Purple400',
					},
				},
				bold: {
					'[default]': {
						value: 'Purple300',
					},
					hovered: {
						value: 'Purple200',
					},
				},
			},
			categorical: {
				1: {
					'[default]': {
						value: 'Blue500',
					},
					hovered: {
						value: 'Blue400',
					},
				},
				2: {
					'[default]': {
						value: 'Lime400',
					},
					hovered: {
						value: 'Lime300',
					},
				},
				3: {
					'[default]': {
						value: 'Purple400',
					},
					hovered: {
						value: 'Purple300',
					},
				},
				4: {
					'[default]': {
						value: 'Orange400',
					},
					hovered: {
						value: 'Orange300',
					},
				},
				5: {
					'[default]': {
						value: 'Blue800',
					},
					hovered: {
						value: 'Blue700',
					},
				},
				6: {
					'[default]': {
						value: 'Purple700',
					},
					hovered: {
						value: 'Purple600',
					},
				},
				7: {
					'[default]': {
						value: 'Teal500',
					},
					hovered: {
						value: 'Teal400',
					},
				},
				8: {
					'[default]': {
						value: 'Orange600',
					},
					hovered: {
						value: 'Orange250',
					},
				},
			},
			blue: {
				bold: {
					'[default]': {
						value: 'Blue600',
					},
					hovered: {
						value: 'Blue500',
					},
				},
				bolder: {
					'[default]': {
						value: 'Blue500',
					},
					hovered: {
						value: 'Blue400',
					},
				},
				boldest: {
					'[default]': {
						value: 'Blue300',
					},
					hovered: {
						value: 'Blue200',
					},
				},
			},
			red: {
				bold: {
					'[default]': {
						value: 'Red600',
					},
					hovered: {
						value: 'Red500',
					},
				},
				bolder: {
					'[default]': {
						value: 'Red500',
					},
					hovered: {
						value: 'Red400',
					},
				},
				boldest: {
					'[default]': {
						value: 'Red300',
					},
					hovered: {
						value: 'Red200',
					},
				},
			},
			orange: {
				bold: {
					'[default]': {
						value: 'Orange500',
					},
					hovered: {
						value: 'Orange400',
					},
				},
				bolder: {
					'[default]': {
						value: 'Orange400',
					},
					hovered: {
						value: 'Orange300',
					},
				},
				boldest: {
					'[default]': {
						value: 'Orange250',
					},
					hovered: {
						value: 'Orange200',
					},
				},
			},
			yellow: {
				bold: {
					'[default]': {
						value: 'Yellow500',
					},
					hovered: {
						value: 'Yellow400',
					},
				},
				bolder: {
					'[default]': {
						value: 'Yellow400',
					},
					hovered: {
						value: 'Yellow300',
					},
				},
				boldest: {
					'[default]': {
						value: 'Yellow300',
					},
					hovered: {
						value: 'Yellow200',
					},
				},
			},
			green: {
				bold: {
					'[default]': {
						value: 'Green500',
					},
					hovered: {
						value: 'Green400',
					},
				},
				bolder: {
					'[default]': {
						value: 'Green400',
					},
					hovered: {
						value: 'Green300',
					},
				},
				boldest: {
					'[default]': {
						value: 'Green300',
					},
					hovered: {
						value: 'Green200',
					},
				},
			},
			teal: {
				bold: {
					'[default]': {
						value: 'Teal500',
					},
					hovered: {
						value: 'Teal400',
					},
				},
				bolder: {
					'[default]': {
						value: 'Teal400',
					},
					hovered: {
						value: 'Teal300',
					},
				},
				boldest: {
					'[default]': {
						value: 'Teal300',
					},
					hovered: {
						value: 'Teal200',
					},
				},
			},
			purple: {
				bold: {
					'[default]': {
						value: 'Purple600',
					},
					hovered: {
						value: 'Purple500',
					},
				},
				bolder: {
					'[default]': {
						value: 'Purple500',
					},
					hovered: {
						value: 'Purple400',
					},
				},
				boldest: {
					'[default]': {
						value: 'Purple300',
					},
					hovered: {
						value: 'Purple200',
					},
				},
			},
			magenta: {
				bold: {
					'[default]': {
						value: 'Magenta600',
					},
					hovered: {
						value: 'Magenta500',
					},
				},
				bolder: {
					'[default]': {
						value: 'Magenta500',
					},
					hovered: {
						value: 'Magenta400',
					},
				},
				boldest: {
					'[default]': {
						value: 'Magenta300',
					},
					hovered: {
						value: 'Magenta200',
					},
				},
			},
			lime: {
				bold: {
					'[default]': {
						value: 'Lime500',
					},
					hovered: {
						value: 'Lime400',
					},
				},
				bolder: {
					'[default]': {
						value: 'Lime400',
					},
					hovered: {
						value: 'Lime300',
					},
				},
				boldest: {
					'[default]': {
						value: 'Lime300',
					},
					hovered: {
						value: 'Lime200',
					},
				},
			},
			gray: {
				bold: {
					'[default]': {
						value: 'DarkNeutral600',
					},
					hovered: {
						value: 'DarkNeutral700',
					},
				},
				bolder: {
					'[default]': {
						value: 'DarkNeutral700',
					},
					hovered: {
						value: 'DarkNeutral800',
					},
				},
				boldest: {
					'[default]': {
						value: 'DarkNeutral800',
					},
					hovered: {
						value: 'DarkNeutral900',
					},
				},
			},
		},
	},
};

export default color;
