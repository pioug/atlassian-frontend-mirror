import type { ChartColorTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/legacy-palette';

const color: ValueSchema<ChartColorTokenSchema<BaseToken>> = {
	color: {
		chart: {
			brand: {
				'[default]': {
					value: 'B300',
				},
				hovered: {
					value: 'B400',
				},
			},
			neutral: {
				'[default]': {
					value: 'N300',
				},
				hovered: {
					value: 'N400',
				},
			},
			success: {
				'[default]': {
					'[default]': {
						value: 'G300',
					},
					hovered: {
						value: 'G400',
					},
				},
				bold: {
					'[default]': {
						value: 'G400',
					},
					hovered: {
						value: 'G500',
					},
				},
			},
			danger: {
				'[default]': {
					'[default]': {
						value: 'R300',
					},
					hovered: {
						value: 'R400',
					},
				},
				bold: {
					'[default]': {
						value: 'R400',
					},
					hovered: {
						value: 'R500',
					},
				},
			},
			warning: {
				'[default]': {
					'[default]': {
						value: 'Y300',
					},
					hovered: {
						value: 'Y400',
					},
				},
				bold: {
					'[default]': {
						value: 'Y400',
					},
					hovered: {
						value: 'Y500',
					},
				},
			},
			information: {
				'[default]': {
					'[default]': {
						value: 'B300',
					},
					hovered: {
						value: 'B400',
					},
				},
				bold: {
					'[default]': {
						value: 'B400',
					},
					hovered: {
						value: 'B500',
					},
				},
			},
			discovery: {
				'[default]': {
					'[default]': {
						value: 'P300',
					},
					hovered: {
						value: 'P400',
					},
				},
				bold: {
					'[default]': {
						value: 'P400',
					},
					hovered: {
						value: 'P500',
					},
				},
			},

			categorical: {
				1: {
					'[default]': {
						value: 'T300',
					},
					hovered: {
						value: 'T400',
					},
				},
				2: {
					'[default]': {
						value: 'P400',
					},
					hovered: {
						value: 'P500',
					},
				},
				3: {
					'[default]': {
						// @ts-expect-error
						value: '#D94008',
					},
					hovered: {
						// @ts-expect-error
						value: '#B65C02',
					},
				},
				4: {
					'[default]': {
						// @ts-expect-error
						value: '#943D73',
					},
					hovered: {
						// @ts-expect-error
						value: '#50253F',
					},
				},
				5: {
					'[default]': {
						value: 'B400',
					},
					hovered: {
						value: 'B500',
					},
				},
				6: {
					'[default]': {
						value: 'P400',
					},
					hovered: {
						value: 'P500',
					},
				},
				7: {
					'[default]': {
						// @ts-expect-error
						value: '#50253F',
					},
					hovered: {
						// @ts-expect-error
						value: '#341829',
					},
				},
				8: {
					'[default]': {
						// @ts-expect-error
						value: '#974F0C',
					},
					hovered: {
						// @ts-expect-error
						value: '#5F3811',
					},
				},
			},
			blue: {
				bold: {
					'[default]': {
						value: 'B300',
					},
					hovered: {
						value: 'B400',
					},
				},
				bolder: {
					'[default]': {
						value: 'B400',
					},
					hovered: {
						value: 'B500',
					},
				},
				boldest: {
					'[default]': {
						value: 'B500',
					},
					hovered: {
						value: 'B500',
					},
				},
			},
			red: {
				bold: {
					'[default]': {
						value: 'R300',
					},
					hovered: {
						value: 'R400',
					},
				},
				bolder: {
					'[default]': {
						value: 'R400',
					},
					hovered: {
						value: 'R500',
					},
				},
				boldest: {
					'[default]': {
						value: 'R500',
					},
					hovered: {
						value: 'R500',
					},
				},
			},
			orange: {
				bold: {
					'[default]': {
						// @ts-expect-error
						value: '#D97008',
					},
					hovered: {
						// @ts-expect-error
						value: '#B65C02',
					},
				},
				bolder: {
					'[default]': {
						// @ts-expect-error
						value: '#B65C02',
					},
					hovered: {
						// @ts-expect-error
						value: '#974F0C',
					},
				},
				boldest: {
					'[default]': {
						// @ts-expect-error
						value: '#974F0C',
					},
					hovered: {
						// @ts-expect-error
						value: '#5F3811',
					},
				},
			},
			yellow: {
				bold: {
					'[default]': {
						value: 'Y300',
					},
					hovered: {
						value: 'Y400',
					},
				},
				bolder: {
					'[default]': {
						value: 'Y400',
					},
					hovered: {
						value: 'Y500',
					},
				},
				boldest: {
					'[default]': {
						value: 'Y500',
					},
					hovered: {
						value: 'Y500',
					},
				},
			},
			green: {
				bold: {
					'[default]': {
						value: 'G300',
					},
					hovered: {
						value: 'G400',
					},
				},
				bolder: {
					'[default]': {
						value: 'G400',
					},
					hovered: {
						value: 'G500',
					},
				},
				boldest: {
					'[default]': {
						value: 'G500',
					},
					hovered: {
						value: 'G500',
					},
				},
			},
			teal: {
				bold: {
					'[default]': {
						value: 'T300',
					},
					hovered: {
						value: 'T400',
					},
				},
				bolder: {
					'[default]': {
						value: 'T400',
					},
					hovered: {
						value: 'T500',
					},
				},
				boldest: {
					'[default]': {
						value: 'T500',
					},
					hovered: {
						value: 'T500',
					},
				},
			},
			purple: {
				bold: {
					'[default]': {
						value: 'P300',
					},
					hovered: {
						value: 'P400',
					},
				},
				bolder: {
					'[default]': {
						value: 'P400',
					},
					hovered: {
						value: 'P500',
					},
				},
				boldest: {
					'[default]': {
						value: 'P500',
					},
					hovered: {
						value: 'P500',
					},
				},
			},
			magenta: {
				bold: {
					'[default]': {
						// @ts-expect-error
						value: '#DA62AC',
					},
					hovered: {
						// @ts-expect-error
						value: '#CD519D',
					},
				},
				bolder: {
					'[default]': {
						// @ts-expect-error
						value: '#CD519D',
					},
					hovered: {
						// @ts-expect-error
						value: '#AE4787',
					},
				},
				boldest: {
					'[default]': {
						// @ts-expect-error
						value: '#943D73',
					},
					hovered: {
						// @ts-expect-error
						value: '#50253F',
					},
				},
			},
			lime: {
				bold: {
					'[default]': {
						// @ts-expect-error
						value: '#6A9A23',
					},
					hovered: {
						// @ts-expect-error
						value: '#5B7F24',
					},
				},
				bolder: {
					'[default]': {
						// @ts-expect-error
						value: '#5B7F24',
					},
					hovered: {
						// @ts-expect-error
						value: '#4C6B1F',
					},
				},
				boldest: {
					'[default]': {
						// @ts-expect-error
						value: '#4C6B1F',
					},
					hovered: {
						// @ts-expect-error
						value: '#37471F',
					},
				},
			},
			gray: {
				bold: {
					'[default]': {
						value: 'N300',
					},
					hovered: {
						value: 'N400',
					},
				},
				bolder: {
					'[default]': {
						value: 'N400',
					},
					hovered: {
						value: 'N500',
					},
				},
				boldest: {
					'[default]': {
						value: 'N500',
					},
					hovered: {
						value: 'N500',
					},
				},
			},
		},
	},
};

export default color;
