import type { AccentColorTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ValueSchema<AccentColorTokenSchema<BaseToken>> = {
	color: {
		text: {
			accent: {
				blue: {
					'[default]': { value: 'Blue300' },
					bolder: { value: 'Blue200' },
				},
				red: {
					'[default]': { value: 'Red300' },
					bolder: { value: 'Red200' },
				},
				orange: {
					'[default]': { value: 'Orange300' },
					bolder: { value: 'Orange200' },
				},
				yellow: {
					'[default]': { value: 'Yellow300' },
					bolder: { value: 'Yellow200' },
				},
				green: {
					'[default]': { value: 'Green300' },
					bolder: { value: 'Green200' },
				},
				purple: {
					'[default]': { value: 'Purple300' },
					bolder: { value: 'Purple200' },
				},
				teal: {
					'[default]': { value: 'Teal300' },
					bolder: { value: 'Teal200' },
				},
				magenta: {
					'[default]': { value: 'Magenta300' },
					bolder: { value: 'Magenta200' },
				},
				lime: {
					'[default]': { value: 'Lime300' },
					bolder: { value: 'Lime200' },
				},
				gray: {
					'[default]': { value: 'DarkNeutral800' },
					bolder: { value: 'DarkNeutral1100' },
				},
			},
		},
		icon: {
			accent: {
				blue: { value: 'Blue500' },
				red: { value: 'Red600' },
				orange: { value: 'Orange500' },
				yellow: { value: 'Yellow300' },
				green: { value: 'Green500' },
				purple: { value: 'Purple500' },
				teal: { value: 'Teal500' },
				magenta: { value: 'Magenta500' },
				lime: { value: 'Lime500' },
				gray: { value: 'DarkNeutral600' },
			},
		},
		border: {
			accent: {
				blue: { value: 'Blue500' },
				red: { value: 'Red500' },
				orange: { value: 'Orange500' },
				yellow: { value: 'Yellow500' },
				green: { value: 'Green500' },
				purple: { value: 'Purple500' },
				teal: { value: 'Teal500' },
				magenta: { value: 'Magenta500' },
				lime: { value: 'Lime500' },
				gray: { value: 'DarkNeutral600' },
			},
		},
		background: {
			accent: {
				blue: {
					subtlest: {
						'[default]': { value: 'Blue1000' },
						hovered: {
							value: 'Blue900',
						},
						pressed: {
							value: 'Blue850',
						},
					},
					subtler: {
						'[default]': { value: 'Blue900' },
						hovered: {
							value: 'Blue850',
						},
						pressed: {
							value: 'Blue800',
						},
					},
					subtle: {
						'[default]': { value: 'Blue800' },
						hovered: {
							value: 'Blue850',
						},
						pressed: {
							value: 'Blue900',
						},
					},
					bolder: {
						'[default]': { value: 'Blue400' },
						hovered: {
							value: 'Blue300',
						},
						pressed: {
							value: 'Blue250',
						},
					},
				},
				red: {
					subtlest: {
						'[default]': { value: 'Red1000' },
						hovered: {
							value: 'Red900',
						},
						pressed: {
							value: 'Red850',
						},
					},
					subtler: {
						'[default]': { value: 'Red900' },
						hovered: {
							value: 'Red850',
						},
						pressed: {
							value: 'Red800',
						},
					},
					subtle: {
						'[default]': { value: 'Red800' },
						hovered: {
							value: 'Red850',
						},
						pressed: {
							value: 'Red900',
						},
					},
					bolder: {
						'[default]': { value: 'Red400' },
						hovered: {
							value: 'Red300',
						},
						pressed: {
							value: 'Red250',
						},
					},
				},
				orange: {
					subtlest: {
						'[default]': { value: 'Orange1000' },
						hovered: {
							value: 'Orange900',
						},
						pressed: {
							value: 'Orange850',
						},
					},
					subtler: {
						'[default]': { value: 'Orange900' },
						hovered: {
							value: 'Orange850',
						},
						pressed: {
							value: 'Orange800',
						},
					},
					subtle: {
						'[default]': { value: 'Orange800' },
						hovered: {
							value: 'Orange850',
						},
						pressed: {
							value: 'Orange900',
						},
					},
					bolder: {
						'[default]': { value: 'Orange400' },
						hovered: {
							value: 'Orange300',
						},
						pressed: {
							value: 'Orange250',
						},
					},
				},
				yellow: {
					subtlest: {
						'[default]': { value: 'Yellow1000' },
						hovered: {
							value: 'Yellow900',
						},
						pressed: {
							value: 'Yellow850',
						},
					},
					subtler: {
						'[default]': { value: 'Yellow900' },
						hovered: {
							value: 'Yellow850',
						},
						pressed: {
							value: 'Yellow800',
						},
					},
					subtle: {
						'[default]': { value: 'Yellow800' },
						hovered: {
							value: 'Yellow850',
						},
						pressed: {
							value: 'Yellow900',
						},
					},
					bolder: {
						'[default]': { value: 'Yellow400' },
						hovered: {
							value: 'Yellow300',
						},
						pressed: {
							value: 'Yellow250',
						},
					},
				},
				green: {
					subtlest: {
						'[default]': { value: 'Green1000' },
						hovered: {
							value: 'Green900',
						},
						pressed: {
							value: 'Green850',
						},
					},
					subtler: {
						'[default]': { value: 'Green900' },
						hovered: {
							value: 'Green850',
						},
						pressed: {
							value: 'Green800',
						},
					},
					subtle: {
						'[default]': { value: 'Green800' },
						hovered: {
							value: 'Green850',
						},
						pressed: {
							value: 'Green900',
						},
					},
					bolder: {
						'[default]': { value: 'Green400' },
						hovered: {
							value: 'Green300',
						},
						pressed: {
							value: 'Green250',
						},
					},
				},
				purple: {
					subtlest: {
						'[default]': { value: 'Purple1000' },
						hovered: {
							value: 'Purple900',
						},
						pressed: {
							value: 'Purple850',
						},
					},
					subtler: {
						'[default]': { value: 'Purple900' },
						hovered: {
							value: 'Purple850',
						},
						pressed: {
							value: 'Purple800',
						},
					},
					subtle: {
						'[default]': { value: 'Purple800' },
						hovered: {
							value: 'Purple850',
						},
						pressed: {
							value: 'Purple900',
						},
					},
					bolder: {
						'[default]': { value: 'Purple400' },
						hovered: {
							value: 'Purple300',
						},
						pressed: {
							value: 'Purple250',
						},
					},
				},
				teal: {
					subtlest: {
						'[default]': { value: 'Teal1000' },
						hovered: {
							value: 'Teal900',
						},
						pressed: {
							value: 'Teal850',
						},
					},
					subtler: {
						'[default]': { value: 'Teal900' },
						hovered: {
							value: 'Teal850',
						},
						pressed: {
							value: 'Teal800',
						},
					},
					subtle: {
						'[default]': { value: 'Teal800' },
						hovered: {
							value: 'Teal850',
						},
						pressed: {
							value: 'Teal900',
						},
					},
					bolder: {
						'[default]': { value: 'Teal400' },
						hovered: {
							value: 'Teal300',
						},
						pressed: {
							value: 'Teal250',
						},
					},
				},
				magenta: {
					subtlest: {
						'[default]': { value: 'Magenta1000' },
						hovered: {
							value: 'Magenta900',
						},
						pressed: {
							value: 'Magenta850',
						},
					},
					subtler: {
						'[default]': { value: 'Magenta900' },
						hovered: {
							value: 'Magenta850',
						},
						pressed: {
							value: 'Magenta800',
						},
					},
					subtle: {
						'[default]': { value: 'Magenta800' },
						hovered: {
							value: 'Magenta850',
						},
						pressed: {
							value: 'Magenta900',
						},
					},
					bolder: {
						'[default]': { value: 'Magenta400' },
						hovered: {
							value: 'Magenta300',
						},
						pressed: {
							value: 'Magenta250',
						},
					},
				},
				lime: {
					subtlest: {
						'[default]': { value: 'Lime1000' },
						hovered: {
							value: 'Lime900',
						},
						pressed: {
							value: 'Lime850',
						},
					},
					subtler: {
						'[default]': { value: 'Lime900' },
						hovered: {
							value: 'Lime850',
						},
						pressed: {
							value: 'Lime800',
						},
					},
					subtle: {
						'[default]': { value: 'Lime800' },
						hovered: {
							value: 'Lime850',
						},
						pressed: {
							value: 'Lime900',
						},
					},
					bolder: {
						'[default]': { value: 'Lime400' },
						hovered: {
							value: 'Lime300',
						},
						pressed: {
							value: 'Lime250',
						},
					},
				},
				gray: {
					subtlest: {
						'[default]': { value: 'DarkNeutral300' },
						hovered: {
							value: 'DarkNeutral350',
						},
						pressed: {
							value: 'DarkNeutral400',
						},
					},
					subtler: {
						'[default]': { value: 'DarkNeutral400' },
						hovered: {
							value: 'DarkNeutral500',
						},
						pressed: {
							value: 'DarkNeutral600',
						},
					},
					subtle: {
						'[default]': { value: 'DarkNeutral500' },
						hovered: {
							value: 'DarkNeutral400',
						},
						pressed: {
							value: 'DarkNeutral350',
						},
					},
					bolder: {
						'[default]': { value: 'DarkNeutral700' },
						hovered: {
							value: 'DarkNeutral800',
						},
						pressed: {
							value: 'DarkNeutral900',
						},
					},
				},
			},
		},
	},
};

export default color;
