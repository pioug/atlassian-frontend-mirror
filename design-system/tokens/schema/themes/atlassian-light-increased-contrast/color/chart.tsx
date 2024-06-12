import type { ChartColorTokenSchema, ExtendedValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ExtendedValueSchema<ChartColorTokenSchema<BaseToken>> = {
	color: {
		chart: {
			brand: {
				'[default]': {
					value: 'Blue700',
				},
				// TODO: Confirm. This token wasn't included in theme design, but color.chart.brand.bold was... and that token doesn't exist?
				// Assuming it's meant to be color.chart.brand.hovered
				hovered: {
					value: 'Blue800',
				},
			},
			neutral: {
				'[default]': {
					value: 'Neutral700',
				},
				hovered: {
					value: 'Neutral800',
				},
			},
			success: {
				'[default]': {
					'[default]': {
						value: 'Green800',
					},
					// TODO: Confirm. No hovered colors included in theme design for many tokens here but I've stepped them up by one
					// or they won't have a color difference to default states
					hovered: {
						value: 'Green900',
					},
				},
				bold: {
					'[default]': {
						value: 'Green900',
					},
					hovered: {
						value: 'Green1000',
					},
				},
			},
			danger: {
				'[default]': {
					'[default]': {
						value: 'Red700',
					},
					hovered: {
						value: 'Red800',
					},
				},
				bold: {
					'[default]': {
						value: 'Red900',
					},
					hovered: {
						value: 'Red1000',
					},
				},
			},
			warning: {
				'[default]': {
					'[default]': {
						value: 'Yellow800',
					},
					hovered: {
						value: 'Yellow900',
					},
				},
				bold: {
					'[default]': {
						value: 'Yellow900',
					},
					hovered: {
						value: 'Yellow1000',
					},
				},
			},
			information: {
				'[default]': {
					'[default]': {
						value: 'Blue700',
					},
					hovered: {
						value: 'Blue800',
					},
				},
				bold: {
					'[default]': {
						value: 'Blue900',
					},
					hovered: {
						value: 'Blue1000',
					},
				},
			},
			discovery: {
				'[default]': {
					'[default]': {
						value: 'Purple700',
					},
					hovered: {
						value: 'Purple800',
					},
				},
				bold: {
					'[default]': {
						value: 'Purple900',
					},
					hovered: {
						value: 'Purple1000',
					},
				},
			},
			categorical: {
				1: {
					'[default]': {
						value: 'Teal800',
					},
					hovered: {
						value: 'Teal900',
					},
				},
				3: {
					'[default]': {
						value: 'Orange800',
					},
					hovered: {
						value: 'Orange900',
					},
				},
				6: {
					'[default]': {
						value: 'Purple800',
					},
					hovered: {
						value: 'Purple900',
					},
				},
			},
			blue: {
				bold: {
					'[default]': {
						value: 'Blue800',
					},
					hovered: {
						value: 'Blue900',
					},
				},
				bolder: {
					'[default]': {
						value: 'Blue900',
					},
					hovered: {
						value: 'Blue1000',
					},
				},
				boldest: {
					'[default]': {
						value: 'Blue1000',
					},
					hovered: {
						// @ts-expect-error TODO: Consider extending palette. Uses value outside range of palettes (would be Blue1100).
						value: '#022353',
					},
				},
			},
			red: {
				bold: {
					'[default]': {
						value: 'Red800',
					},
					hovered: {
						value: 'Red900',
					},
				},
				bolder: {
					'[default]': {
						value: 'Red900',
					},
					hovered: {
						value: 'Red1000',
					},
				},
				boldest: {
					'[default]': {
						value: 'Red1000',
					},
					hovered: {
						// @ts-expect-error TODO: Consider extending palette. Uses value outside range of palettes (would be Red1100).
						value: '#49120C',
					},
				},
			},
			orange: {
				bold: {
					'[default]': {
						value: 'Orange800',
					},
					hovered: {
						value: 'Orange900',
					},
				},
				bolder: {
					'[default]': {
						value: 'Orange900',
					},
					hovered: {
						value: 'Orange1000',
					},
				},
				boldest: {
					'[default]': {
						value: 'Orange1000',
					},
					hovered: {
						// @ts-expect-error TODO: Consider extending palette. Uses value outside range of palettes (would be Orange1100).
						value: '#3E2108',
					},
				},
			},
			yellow: {
				bold: {
					'[default]': {
						value: 'Yellow800',
					},
					hovered: {
						value: 'Yellow900',
					},
				},
				bolder: {
					'[default]': {
						value: 'Yellow900',
					},
					hovered: {
						value: 'Yellow1000',
					},
				},
				boldest: {
					'[default]': {
						value: 'Yellow1000',
					},
					hovered: {
						// @ts-expect-error TODO: Consider extending palette. Uses value outside range of palettes (would be Yellow1100).
						value: '#342800',
					},
				},
			},
			green: {
				bold: {
					'[default]': {
						value: 'Green800',
					},
					hovered: {
						value: 'Green900',
					},
				},
				bolder: {
					'[default]': {
						value: 'Green900',
					},
					hovered: {
						value: 'Green1000',
					},
				},
				boldest: {
					'[default]': {
						value: 'Green1000',
					},
					hovered: {
						// @ts-expect-error TODO: Consider extending palette. Uses value outside range of palettes (would be Green1100).
						value: '#0F3324',
					},
				},
			},
			teal: {
				bold: {
					'[default]': {
						value: 'Teal800',
					},
					hovered: {
						value: 'Teal900',
					},
				},
				bolder: {
					'[default]': {
						value: 'Teal900',
					},
					hovered: {
						value: 'Teal1000',
					},
				},
				boldest: {
					'[default]': {
						value: 'Teal1000',
					},
					hovered: {
						// @ts-expect-error TODO: Consider extending palette. Uses value outside range of palettes (would be Teal1100).
						value: '#103034',
					},
				},
			},
			purple: {
				bold: {
					'[default]': {
						value: 'Purple800',
					},
					hovered: {
						value: 'Purple900',
					},
				},
				bolder: {
					'[default]': {
						value: 'Purple900',
					},
					hovered: {
						value: 'Purple1000',
					},
				},
				boldest: {
					'[default]': {
						value: 'Purple1000',
					},
					hovered: {
						// @ts-expect-error TODO: Consider extending palette. Uses value outside range of palettes (would be Purple1100).
						value: '#211A47',
					},
				},
			},
			magenta: {
				bold: {
					'[default]': {
						value: 'Magenta800',
					},
					hovered: {
						value: 'Magenta900',
					},
				},
				bolder: {
					'[default]': {
						value: 'Magenta900',
					},
					hovered: {
						value: 'Magenta1000',
					},
				},
				boldest: {
					'[default]': {
						value: 'Magenta1000',
					},
					hovered: {
						// @ts-expect-error TODO: Consider extending palette. Uses value outside range of palettes (would be Magenta1100).
						value: '#37172A',
					},
				},
			},
			lime: {
				bold: {
					'[default]': {
						value: 'Lime800',
					},
					hovered: {
						value: 'Lime900',
					},
				},
				bolder: {
					'[default]': {
						value: 'Lime900',
					},
					hovered: {
						value: 'Lime1000',
					},
				},
				boldest: {
					'[default]': {
						value: 'Lime1000',
					},
					hovered: {
						// @ts-expect-error TODO: Consider extending palette. Uses value outside range of palettes (would be Lime1100).
						value: '#233013',
					},
				},
			},
			gray: {
				bold: {
					'[default]': {
						value: 'Neutral700',
					},
					hovered: {
						value: 'Neutral800',
					},
				},
				bolder: {
					'[default]': {
						value: 'Neutral800',
					},
					hovered: {
						value: 'Neutral900',
					},
				},
				boldest: {
					'[default]': {
						value: 'Neutral900',
					},
					hovered: {
						value: 'Neutral1000',
					},
				},
			},
		},
	},
};

export default color;
