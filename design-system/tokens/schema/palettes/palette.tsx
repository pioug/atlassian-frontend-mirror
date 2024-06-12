import type { PaletteColorTokenSchema } from '../../src/types';

export type PaletteValues =
	| 'Blue100'
	| 'Blue200'
	| 'Blue300'
	| 'Blue400'
	| 'Blue500'
	| 'Blue600'
	| 'Blue700'
	| 'Blue800'
	| 'Blue900'
	| 'Blue1000'
	| 'Red100'
	| 'Red200'
	| 'Red300'
	| 'Red400'
	| 'Red500'
	| 'Red600'
	| 'Red700'
	| 'Red800'
	| 'Red900'
	| 'Red1000'
	| 'Yellow100'
	| 'Yellow200'
	| 'Yellow300'
	| 'Yellow400'
	| 'Yellow500'
	| 'Yellow600'
	| 'Yellow700'
	| 'Yellow800'
	| 'Yellow900'
	| 'Yellow1000'
	| 'Green100'
	| 'Green200'
	| 'Green300'
	| 'Green400'
	| 'Green500'
	| 'Green600'
	| 'Green700'
	| 'Green800'
	| 'Green900'
	| 'Green1000'
	| 'Purple100'
	| 'Purple200'
	| 'Purple300'
	| 'Purple400'
	| 'Purple500'
	| 'Purple600'
	| 'Purple700'
	| 'Purple800'
	| 'Purple900'
	| 'Purple1000'
	| 'Teal100'
	| 'Teal200'
	| 'Teal300'
	| 'Teal400'
	| 'Teal500'
	| 'Teal600'
	| 'Teal700'
	| 'Teal800'
	| 'Teal900'
	| 'Teal1000'
	| 'Orange100'
	| 'Orange200'
	| 'Orange300'
	| 'Orange400'
	| 'Orange500'
	| 'Orange600'
	| 'Orange700'
	| 'Orange800'
	| 'Orange900'
	| 'Orange1000'
	| 'Magenta100'
	| 'Magenta200'
	| 'Magenta300'
	| 'Magenta400'
	| 'Magenta500'
	| 'Magenta600'
	| 'Magenta700'
	| 'Magenta800'
	| 'Magenta900'
	| 'Magenta1000'
	| 'Lime100'
	| 'Lime200'
	| 'Lime300'
	| 'Lime400'
	| 'Lime500'
	| 'Lime600'
	| 'Lime700'
	| 'Lime800'
	| 'Lime900'
	| 'Lime1000'
	| 'DarkNeutral-100'
	| 'DarkNeutral-100A'
	| 'DarkNeutral0'
	| 'DarkNeutral100'
	| 'DarkNeutral100A'
	| 'DarkNeutral200'
	| 'DarkNeutral200A'
	| 'DarkNeutral250'
	| 'DarkNeutral250A'
	| 'DarkNeutral300'
	| 'DarkNeutral300A'
	| 'DarkNeutral350'
	| 'DarkNeutral350A'
	| 'DarkNeutral400'
	| 'DarkNeutral400A'
	| 'DarkNeutral500'
	| 'DarkNeutral500A'
	| 'DarkNeutral600'
	| 'DarkNeutral700'
	| 'DarkNeutral800'
	| 'DarkNeutral900'
	| 'DarkNeutral1000'
	| 'DarkNeutral1100'
	| 'Neutral0'
	| 'Neutral100'
	| 'Neutral100A'
	| 'Neutral200'
	| 'Neutral200A'
	| 'Neutral300'
	| 'Neutral300A'
	| 'Neutral400'
	| 'Neutral400A'
	| 'Neutral500'
	| 'Neutral500A'
	| 'Neutral600'
	| 'Neutral700'
	| 'Neutral800'
	| 'Neutral900'
	| 'Neutral1000'
	| 'Neutral1100';

export type BaseToken = keyof PaletteColorTokenSchema<PaletteValues>['color']['palette'];

const palette: PaletteColorTokenSchema<PaletteValues> = {
	value: {
		opacity: {
			Opacity20: {
				value: 0.2,
				attributes: {
					group: 'palette',
					category: 'opacity',
				},
			},
			Opacity40: {
				value: 0.4,
				attributes: {
					group: 'palette',
					category: 'opacity',
				},
			},
		},
	},
	color: {
		palette: {
			Blue100: {
				value: '#E9F2FF',
				attributes: {
					group: 'palette',
					category: 'blue',
				},
			},
			Blue200: {
				value: '#CCE0FF',
				attributes: {
					group: 'palette',
					category: 'blue',
				},
			},
			Blue300: {
				value: '#85B8FF',
				attributes: {
					group: 'palette',
					category: 'blue',
				},
			},
			Blue400: {
				value: '#579DFF',
				attributes: {
					group: 'palette',
					category: 'blue',
				},
			},
			Blue500: {
				value: '#388BFF',
				attributes: {
					group: 'palette',
					category: 'blue',
				},
			},
			Blue600: {
				value: '#1D7AFC',
				attributes: {
					group: 'palette',
					category: 'blue',
				},
			},
			Blue700: {
				value: '#0C66E4',
				attributes: {
					group: 'palette',
					category: 'blue',
				},
			},
			Blue800: {
				value: '#0055CC',
				attributes: {
					group: 'palette',
					category: 'blue',
				},
			},
			Blue900: {
				value: '#09326C',
				attributes: {
					group: 'palette',
					category: 'blue',
				},
			},
			Blue1000: {
				value: '#1C2B41',
				attributes: {
					group: 'palette',
					category: 'blue',
				},
			},
			Red100: {
				value: '#FFECEB',
				attributes: {
					group: 'palette',
					category: 'red',
				},
			},
			Red200: {
				value: '#FFD5D2',
				attributes: {
					group: 'palette',
					category: 'red',
				},
			},
			Red300: {
				value: '#FD9891',
				attributes: {
					group: 'palette',
					category: 'red',
				},
			},
			Red400: {
				value: '#F87168',
				attributes: {
					group: 'palette',
					category: 'red',
				},
			},
			Red500: {
				value: '#F15B50',
				attributes: {
					group: 'palette',
					category: 'red',
				},
			},
			Red600: {
				value: '#E2483D',
				attributes: {
					group: 'palette',
					category: 'red',
				},
			},
			Red700: {
				value: '#C9372C',
				attributes: {
					group: 'palette',
					category: 'red',
				},
			},
			Red800: {
				value: '#AE2E24',
				attributes: {
					group: 'palette',
					category: 'red',
				},
			},
			Red900: {
				value: '#5D1F1A',
				attributes: {
					group: 'palette',
					category: 'red',
				},
			},
			Red1000: {
				value: '#42221F',
				attributes: {
					group: 'palette',
					category: 'red',
				},
			},
			Yellow100: {
				value: '#FFF7D6',
				attributes: {
					group: 'palette',
					category: 'yellow',
				},
			},
			Yellow200: {
				value: '#F8E6A0',
				attributes: {
					group: 'palette',
					category: 'yellow',
				},
			},
			Yellow300: {
				value: '#F5CD47',
				attributes: {
					group: 'palette',
					category: 'yellow',
				},
			},
			Yellow400: {
				value: '#E2B203',
				attributes: {
					group: 'palette',
					category: 'yellow',
				},
			},
			Yellow500: {
				value: '#CF9F02',
				attributes: {
					group: 'palette',
					category: 'yellow',
				},
			},
			Yellow600: {
				value: '#B38600',
				attributes: {
					group: 'palette',
					category: 'yellow',
				},
			},
			Yellow700: {
				value: '#946F00',
				attributes: {
					group: 'palette',
					category: 'yellow',
				},
			},
			Yellow800: {
				value: '#7F5F01',
				attributes: {
					group: 'palette',
					category: 'yellow',
				},
			},
			Yellow900: {
				value: '#533F04',
				attributes: {
					group: 'palette',
					category: 'yellow',
				},
			},
			Yellow1000: {
				value: '#332E1B',
				attributes: {
					group: 'palette',
					category: 'yellow',
				},
			},
			Green100: {
				value: '#DCFFF1',
				attributes: {
					group: 'palette',
					category: 'green',
				},
			},
			Green200: {
				value: '#BAF3DB',
				attributes: {
					group: 'palette',
					category: 'green',
				},
			},
			Green300: {
				value: '#7EE2B8',
				attributes: {
					group: 'palette',
					category: 'green',
				},
			},
			Green400: {
				value: '#4BCE97',
				attributes: {
					group: 'palette',
					category: 'green',
				},
			},
			Green500: {
				value: '#2ABB7F',
				attributes: {
					group: 'palette',
					category: 'green',
				},
			},
			Green600: {
				value: '#22A06B',
				attributes: {
					group: 'palette',
					category: 'green',
				},
			},
			Green700: {
				value: '#1F845A',
				attributes: {
					group: 'palette',
					category: 'green',
				},
			},
			Green800: {
				value: '#216E4E',
				attributes: {
					group: 'palette',
					category: 'green',
				},
			},
			Green900: {
				value: '#164B35',
				attributes: {
					group: 'palette',
					category: 'green',
				},
			},
			Green1000: {
				value: '#1C3329',
				attributes: {
					group: 'palette',
					category: 'green',
				},
			},
			Purple100: {
				value: '#F3F0FF',
				attributes: {
					group: 'palette',
					category: 'purple',
				},
			},
			Purple200: {
				value: '#DFD8FD',
				attributes: {
					group: 'palette',
					category: 'purple',
				},
			},
			Purple300: {
				value: '#B8ACF6',
				attributes: {
					group: 'palette',
					category: 'purple',
				},
			},
			Purple400: {
				value: '#9F8FEF',
				attributes: {
					group: 'palette',
					category: 'purple',
				},
			},
			Purple500: {
				value: '#8F7EE7',
				attributes: {
					group: 'palette',
					category: 'purple',
				},
			},
			Purple600: {
				value: '#8270DB',
				attributes: {
					group: 'palette',
					category: 'purple',
				},
			},
			Purple700: {
				value: '#6E5DC6',
				attributes: {
					group: 'palette',
					category: 'purple',
				},
			},
			Purple800: {
				value: '#5E4DB2',
				attributes: {
					group: 'palette',
					category: 'purple',
				},
			},
			Purple900: {
				value: '#352C63',
				attributes: {
					group: 'palette',
					category: 'purple',
				},
			},
			Purple1000: {
				value: '#2B273F',
				attributes: {
					group: 'palette',
					category: 'purple',
				},
			},
			Teal100: {
				value: '#E7F9FF',
				attributes: {
					group: 'palette',
					category: 'teal',
				},
			},
			Teal200: {
				value: '#C6EDFB',
				attributes: {
					group: 'palette',
					category: 'teal',
				},
			},
			Teal300: {
				value: '#9DD9EE',
				attributes: {
					group: 'palette',
					category: 'teal',
				},
			},
			Teal400: {
				value: '#6CC3E0',
				attributes: {
					group: 'palette',
					category: 'teal',
				},
			},
			Teal500: {
				value: '#42B2D7',
				attributes: {
					group: 'palette',
					category: 'teal',
				},
			},
			Teal600: {
				value: '#2898BD',
				attributes: {
					group: 'palette',
					category: 'teal',
				},
			},
			Teal700: {
				value: '#227D9B',
				attributes: {
					group: 'palette',
					category: 'teal',
				},
			},
			Teal800: {
				value: '#206A83',
				attributes: {
					group: 'palette',
					category: 'teal',
				},
			},
			Teal900: {
				value: '#164555',
				attributes: {
					group: 'palette',
					category: 'teal',
				},
			},
			Teal1000: {
				value: '#1E3137',
				attributes: {
					group: 'palette',
					category: 'teal',
				},
			},
			Orange100: {
				value: '#FFF3EB',
				attributes: {
					group: 'palette',
					category: 'orange',
				},
			},
			Orange200: {
				value: '#FEDEC8',
				attributes: {
					group: 'palette',
					category: 'orange',
				},
			},
			Orange300: {
				value: '#FEC195',
				attributes: {
					group: 'palette',
					category: 'orange',
				},
			},
			Orange400: {
				value: '#FEA362',
				attributes: {
					group: 'palette',
					category: 'orange',
				},
			},
			Orange500: {
				value: '#F38A3F',
				attributes: {
					group: 'palette',
					category: 'orange',
				},
			},
			Orange600: {
				value: '#E56910',
				attributes: {
					group: 'palette',
					category: 'orange',
				},
			},
			Orange700: {
				value: '#C25100',
				attributes: {
					group: 'palette',
					category: 'orange',
				},
			},
			Orange800: {
				value: '#A54800',
				attributes: {
					group: 'palette',
					category: 'orange',
				},
			},
			Orange900: {
				value: '#702E00',
				attributes: {
					group: 'palette',
					category: 'orange',
				},
			},
			Orange1000: {
				value: '#38291E',
				attributes: {
					group: 'palette',
					category: 'orange',
				},
			},
			Magenta100: {
				value: '#FFECF8',
				attributes: {
					group: 'palette',
					category: 'magenta',
				},
			},
			Magenta200: {
				value: '#FDD0EC',
				attributes: {
					group: 'palette',
					category: 'magenta',
				},
			},
			Magenta300: {
				value: '#F797D2',
				attributes: {
					group: 'palette',
					category: 'magenta',
				},
			},
			Magenta400: {
				value: '#E774BB',
				attributes: {
					group: 'palette',
					category: 'magenta',
				},
			},
			Magenta500: {
				value: '#DA62AC',
				attributes: {
					group: 'palette',
					category: 'magenta',
				},
			},
			Magenta600: {
				value: '#CD519D',
				attributes: {
					group: 'palette',
					category: 'magenta',
				},
			},
			Magenta700: {
				value: '#AE4787',
				attributes: {
					group: 'palette',
					category: 'magenta',
				},
			},
			Magenta800: {
				value: '#943D73',
				attributes: {
					group: 'palette',
					category: 'magenta',
				},
			},
			Magenta900: {
				value: '#50253F',
				attributes: {
					group: 'palette',
					category: 'magenta',
				},
			},
			Magenta1000: {
				value: '#3D2232',
				attributes: {
					group: 'palette',
					category: 'magenta',
				},
			},
			Lime100: {
				value: '#EFFFD6',
				attributes: {
					group: 'palette',
					category: 'lime',
				},
			},
			Lime200: {
				value: '#D3F1A7',
				attributes: {
					group: 'palette',
					category: 'lime',
				},
			},
			Lime300: {
				value: '#B3DF72',
				attributes: {
					group: 'palette',
					category: 'lime',
				},
			},
			Lime400: {
				value: '#94C748',
				attributes: {
					group: 'palette',
					category: 'lime',
				},
			},
			Lime500: {
				value: '#82B536',
				attributes: {
					group: 'palette',
					category: 'lime',
				},
			},
			Lime600: {
				value: '#6A9A23',
				attributes: {
					group: 'palette',
					category: 'lime',
				},
			},
			Lime700: {
				value: '#5B7F24',
				attributes: {
					group: 'palette',
					category: 'lime',
				},
			},
			Lime800: {
				value: '#4C6B1F',
				attributes: {
					group: 'palette',
					category: 'lime',
				},
			},
			Lime900: {
				value: '#37471F',
				attributes: {
					group: 'palette',
					category: 'lime',
				},
			},
			Lime1000: {
				value: '#28311B',
				attributes: {
					group: 'palette',
					category: 'lime',
				},
			},
			'DarkNeutral-100': {
				value: '#101214',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			'DarkNeutral-100A': {
				// #030404 26%
				value: '#03040442',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral0: {
				value: '#161A1D',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral100: {
				value: '#1D2125',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral100A: {
				// #BCD6F0 4%
				value: '#BCD6F00A',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral200: {
				value: '#22272B',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral200A: {
				// #A1BDD9 8%
				value: '#A1BDD914',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral250: {
				value: '#282E33',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral250A: {
				// #C8E1F9 10%
				value: '#C8E1F91A',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral300: {
				value: '#2C333A',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral300A: {
				// #A6C5E2 16%
				value: '#A6C5E229',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral350: {
				value: '#38414A',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral350A: {
				// #C3DEFE 20%
				value: '#C3DEFE33',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral400: {
				value: '#454F59',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral400A: {
				// #BFDBF8 28%
				value: '#BFDBF847',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral500: {
				value: '#596773',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral500A: {
				// #9BB4CA @50%
				value: '#9BB4CA80',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral600: {
				value: '#738496',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral700: {
				value: '#8C9BAB',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral800: {
				value: '#9FADBC',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral900: {
				value: '#B6C2CF',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral1000: {
				value: '#C7D1DB',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral1100: {
				value: '#DEE4EA',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			Neutral0: {
				value: '#FFFFFF',
				attributes: {
					group: 'palette',
					category: 'light mode neutral',
				},
			},
			Neutral100: {
				value: '#F7F8F9',
				attributes: {
					group: 'palette',
					category: 'light mode neutral',
				},
			},
			Neutral100A: {
				// #091E42 3%
				value: '#091E4208',
				attributes: {
					group: 'palette',
					category: 'light mode neutral',
				},
			},
			Neutral200: {
				value: '#F1F2F4',
				attributes: {
					group: 'palette',
					category: 'light mode neutral',
				},
			},
			Neutral200A: {
				// #091E42 6%
				value: '#091E420F',
				attributes: {
					group: 'palette',
					category: 'light mode neutral',
				},
			},
			Neutral300: {
				value: '#DCDFE4',
				attributes: {
					group: 'palette',
					category: 'light mode neutral',
				},
			},
			Neutral300A: {
				// #091E42 14%
				value: '#091E4224',
				attributes: {
					group: 'palette',
					category: 'light mode neutral',
				},
			},
			Neutral400: {
				value: '#B3B9C4',
				attributes: {
					group: 'palette',
					category: 'light mode neutral',
				},
			},
			Neutral400A: {
				// #091E42 31%
				value: '#091E424F',
				attributes: {
					group: 'palette',
					category: 'light mode neutral',
				},
			},
			Neutral500: {
				value: '#8590A2',
				attributes: {
					group: 'palette',
					category: 'light mode neutral',
				},
			},
			Neutral500A: {
				// #091E42 49%
				value: '#091E427D',
				attributes: {
					group: 'palette',
					category: 'light mode neutral',
				},
			},
			Neutral600: {
				value: '#758195',
				attributes: {
					group: 'palette',
					category: 'light mode neutral',
				},
			},
			Neutral700: {
				value: '#626F86',
				attributes: {
					group: 'palette',
					category: 'light mode neutral',
				},
			},
			Neutral800: {
				value: '#44546F',
				attributes: {
					group: 'palette',
					category: 'light mode neutral',
				},
			},
			Neutral900: {
				value: '#2C3E5D',
				attributes: {
					group: 'palette',
					category: 'light mode neutral',
				},
			},
			Neutral1000: {
				value: '#172B4D',
				attributes: {
					group: 'palette',
					category: 'light mode neutral',
				},
			},
			Neutral1100: {
				value: '#091E42',
				attributes: {
					group: 'palette',
					category: 'light mode neutral',
				},
			},
		},
	},
};

export default palette;
