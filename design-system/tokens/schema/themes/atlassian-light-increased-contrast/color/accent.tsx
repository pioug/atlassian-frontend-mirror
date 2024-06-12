import type { AccentColorTokenSchema, ExtendedValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ExtendedValueSchema<AccentColorTokenSchema<BaseToken>> = {
	color: {
		text: {
			accent: {
				blue: {
					'[default]': { value: 'Blue900' },
					bolder: { value: 'Blue1000' },
				},
				red: {
					'[default]': { value: 'Red900' },
					bolder: { value: 'Red1000' },
				},
				orange: {
					'[default]': { value: 'Orange900' },
					bolder: { value: 'Orange1000' },
				},
				yellow: {
					'[default]': { value: 'Yellow900' },
					bolder: { value: 'Yellow1000' },
				},
				green: {
					'[default]': { value: 'Green900' },
					bolder: { value: 'Green1000' },
				},
				purple: {
					'[default]': { value: 'Purple900' },
					bolder: { value: 'Purple1000' },
				},
				teal: {
					'[default]': { value: 'Teal900' },
					bolder: { value: 'Teal1000' },
				},
				magenta: {
					'[default]': { value: 'Magenta900' },
					bolder: { value: 'Magenta1000' },
				},
				lime: {
					'[default]': { value: 'Lime900' },
					bolder: { value: 'Lime1000' },
				},
				gray: {
					'[default]': { value: 'Neutral900' },
					// TODO: Confirm. In theme design this is Neutral1000, which is lighter
					// than the original theme's Neutral1100
					bolder: { value: 'Neutral1000' },
				},
			},
		},
		icon: {
			accent: {
				blue: { value: 'Blue800' },
				red: { value: 'Red800' },
				orange: { value: 'Orange800' },
				yellow: { value: 'Yellow800' },
				green: { value: 'Green800' },
				purple: { value: 'Purple800' },
				teal: { value: 'Teal800' },
				magenta: { value: 'Magenta800' },
				lime: { value: 'Lime800' },
				gray: { value: 'Neutral800' },
			},
		},
		border: {
			accent: {
				blue: { value: 'Blue800' },
				red: { value: 'Red800' },
				orange: { value: 'Orange800' },
				yellow: { value: 'Yellow800' },
				green: { value: 'Green800' },
				purple: { value: 'Purple800' },
				teal: { value: 'Teal800' },
				magenta: { value: 'Magenta800' },
				lime: { value: 'Lime800' },
				gray: { value: 'Neutral800' },
			},
		},
		background: {
			accent: {
				blue: {
					// TODO: Confirm - no `subtlest` or `subtler` tokens in theme design. Assume this is intentional but will check
					subtle: {
						'[default]': { value: 'Blue300' },
						hovered: {
							value: 'Blue200',
						},
						pressed: {
							value: 'Blue100',
						},
					},
					bolder: {
						'[default]': { value: 'Blue900' },
						hovered: {
							value: 'Blue1000',
						},
						pressed: {
							// @ts-expect-error TODO: Consider extending palette. Uses value outside range of palettes (would be Blue1100).
							value: '#022353',
						},
					},
				},
				red: {
					subtle: {
						// TODO: Confirm - custom value used but seems close enough to snap to Red200?
						// @ts-expect-error
						'[default]': { value: '#fbb7ae' },
						hovered: {
							value: 'Red200',
						},
						pressed: {
							value: 'Red100',
						},
					},
					bolder: {
						'[default]': { value: 'Red900' },
						hovered: {
							value: 'Red1000',
						},
						pressed: {
							// @ts-expect-error TODO: Consider extending palette. Uses value outside range of palettes (would be Red1100).
							value: '#49120C',
						},
					},
				},
				orange: {
					subtle: {
						'[default]': { value: 'Orange300' },
						hovered: {
							value: 'Orange200',
						},
						pressed: {
							value: 'Orange100',
						},
					},
					bolder: {
						'[default]': { value: 'Orange900' },
						hovered: {
							value: 'Orange1000',
						},
						pressed: {
							// @ts-expect-error TODO: Consider extending palette. Uses value outside range of palettes (would be Orange1100).
							value: '#3E2108',
						},
					},
				},
				yellow: {
					subtle: {
						'[default]': { value: 'Yellow300' },
						hovered: {
							value: 'Yellow200',
						},
						pressed: {
							value: 'Yellow100',
						},
					},
					bolder: {
						'[default]': { value: 'Yellow900' },
						hovered: {
							value: 'Yellow1000',
						},
						pressed: {
							// @ts-expect-error TODO: Consider extending palette. Uses value outside range of palettes (would be Yellow1100).
							value: '#342800',
						},
					},
				},
				green: {
					subtle: {
						'[default]': { value: 'Green300' },
						hovered: {
							value: 'Green200',
						},
						pressed: {
							value: 'Green100',
						},
					},
					bolder: {
						'[default]': { value: 'Green900' },
						hovered: {
							value: 'Green1000',
						},
						pressed: {
							// @ts-expect-error TODO: Consider extending palette. Uses value outside range of palettes (would be Green1100).
							value: '#0F3324',
						},
					},
				},
				purple: {
					subtle: {
						// @ts-expect-error
						'[default]': { value: '#c3b9fa' },
						hovered: {
							value: 'Purple200',
						},
						pressed: {
							value: 'Purple100',
						},
					},
					bolder: {
						'[default]': { value: 'Purple900' },
						hovered: {
							value: 'Purple1000',
						},
						pressed: {
							// @ts-expect-error TODO: Consider extending palette. Uses value outside range of palettes (would be Purple1100).
							value: '#211A47',
						},
					},
				},
				teal: {
					subtle: {
						'[default]': { value: 'Teal300' },
						hovered: {
							value: 'Teal200',
						},
						pressed: {
							value: 'Teal100',
						},
					},
					bolder: {
						'[default]': { value: 'Teal900' },
						hovered: {
							value: 'Teal1000',
						},
						pressed: {
							// @ts-expect-error TODO: Consider extending palette. Uses value outside range of palettes (would be Teal1100).
							value: '#103034',
						},
					},
				},
				magenta: {
					subtle: {
						// @ts-expect-error
						'[default]': { value: '#f2a6d4' },
						hovered: {
							value: 'Magenta200',
						},
						pressed: {
							value: 'Magenta100',
						},
					},
					bolder: {
						'[default]': { value: 'Magenta900' },
						hovered: {
							value: 'Magenta1000',
						},
						pressed: {
							// @ts-expect-error TODO: Consider extending palette. Uses value outside range of palettes (would be Magenta1100).
							value: '#37172A',
						},
					},
				},
				lime: {
					subtle: {
						'[default]': { value: 'Lime300' },
						hovered: {
							value: 'Lime200',
						},
						pressed: {
							value: 'Lime100',
						},
					},
					bolder: {
						'[default]': { value: 'Lime900' },
						hovered: {
							value: 'Lime1000',
						},
						pressed: {
							// @ts-expect-error TODO: Consider extending palette. Uses value outside range of palettes (would be Lime1100).
							value: '#233013',
						},
					},
				},
				gray: {
					subtle: {
						'[default]': { value: 'Neutral400' },
						hovered: {
							value: 'Neutral300',
						},
						pressed: {
							value: 'Neutral200',
						},
					},
					bolder: {
						'[default]': { value: 'Neutral800' },
						hovered: {
							value: 'Neutral900',
						},
						pressed: {
							value: 'Neutral1000',
						},
					},
				},
			},
		},
	},
};

export default color;
