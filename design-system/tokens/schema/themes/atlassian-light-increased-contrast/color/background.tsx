import type { BackgroundColorTokenSchema, ExtendedValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ExtendedValueSchema<BackgroundColorTokenSchema<BaseToken>> = {
	color: {
		// TODO: Confirm - commented out tokens not included in theme design
		// but may be suitable?
		// blanket: {
		//   '[default]': { value: 'Neutral500A' },
		//   // @ts-ignore temporary value (Blue500 8% opacity)
		//   selected: { value: '#388BFF14' },
		//   // @ts-ignore temporary value (Red500 8% opacity)
		//   danger: { value: '#EF5C4814' },
		// },
		background: {
			// disabled: { value: 'Neutral100A' },
			// neutral: {
			//   '[default]': {
			//     '[default]': { value: 'Neutral200A' },
			//     hovered: { value: 'Neutral300A' },
			//     pressed: { value: 'Neutral400A' },
			//   },
			//   subtle: {
			//     // @ts-ignore temporary value
			//     '[default]': { value: 'transparent' },
			//     hovered: { value: 'Neutral200A' },
			//     pressed: { value: 'Neutral300A' },
			//   },
			//   bold: {
			//     '[default]': { value: 'Neutral800' },
			//     hovered: { value: 'Neutral900' },
			//     pressed: { value: 'Neutral1000' },
			//   },
			// },
			brand: {
				bold: {
					'[default]': { value: 'Blue900' },
					hovered: { value: 'Blue1000' },
					pressed: {
						// @ts-expect-error TODO: Consider extending palette. Uses value outside range of palettes (would be Blue1100).
						value: '#022353',
					},
				},
				// boldest: {
				//   '[default]': { value: 'Blue1000' },
				//   hovered: { value: 'Blue900' },
				//   pressed: { value: 'Blue800' },
				// },
			},
			selected: {
				bold: {
					'[default]': { value: 'Blue900' },
					hovered: { value: 'Blue1000' },
					pressed: {
						// @ts-expect-error TODO: Consider extending palette. Uses value outside range of palettes (would be Blue1100).
						value: '#022353',
					},
				},
			},
			danger: {
				bold: {
					'[default]': { value: 'Red900' },
					hovered: { value: 'Red1000' },
					pressed: {
						// @ts-expect-error TODO: Consider extending palette. Uses value outside range of palettes (would be Red1100).
						value: '#49120C',
					},
				},
			},
			warning: {
				bold: {
					'[default]': { value: 'Yellow900' },
					hovered: { value: 'Yellow1000' },
					pressed: {
						// @ts-expect-error TODO: Consider extending palette. Uses value outside range of palettes (would be Yellow1100).
						value: '#342800',
					},
				},
			},
			success: {
				bold: {
					'[default]': { value: 'Green900' },
					hovered: { value: 'Green1000' },
					pressed: {
						// @ts-expect-error TODO: Consider extending palette. Uses value outside range of palettes (would be Green1100).
						value: '#0F3324',
					},
				},
			},
			discovery: {
				bold: {
					'[default]': { value: 'Purple900' },
					hovered: { value: 'Purple1000' },
					pressed: {
						// @ts-expect-error TODO: Consider extending palette. Uses value outside range of palettes (would be Purple1100).
						value: '#211A47',
					},
				},
			},
			information: {
				bold: {
					'[default]': { value: 'Blue900' },
					hovered: { value: 'Blue1000' },
					pressed: {
						// @ts-expect-error TODO: Consider extending palette. Uses value outside range of palettes (would be Blue1100).
						value: '#022353',
					},
				},
			},
		},
	},
};

export default color;
