import type { PaletteColorTokenSchema } from '../../src/types';

export type PaletteValues =
	| 'Blue100'
	| 'Blue200'
	| 'Blue250'
	| 'Blue300'
	| 'Blue400'
	| 'Blue500'
	| 'Blue600'
	| 'Blue700'
	| 'Blue800'
	| 'Blue850'
	| 'Blue900'
	| 'Blue1000'
	| 'Red100'
	| 'Red200'
	| 'Red250'
	| 'Red300'
	| 'Red400'
	| 'Red500'
	| 'Red600'
	| 'Red700'
	| 'Red800'
	| 'Red850'
	| 'Red900'
	| 'Red1000'
	| 'Yellow100'
	| 'Yellow200'
	| 'Yellow250'
	| 'Yellow300'
	| 'Yellow400'
	| 'Yellow500'
	| 'Yellow600'
	| 'Yellow700'
	| 'Yellow800'
	| 'Yellow850'
	| 'Yellow900'
	| 'Yellow1000'
	| 'Green100'
	| 'Green200'
	| 'Green250'
	| 'Green300'
	| 'Green400'
	| 'Green500'
	| 'Green600'
	| 'Green700'
	| 'Green800'
	| 'Green850'
	| 'Green900'
	| 'Green1000'
	| 'Purple100'
	| 'Purple200'
	| 'Purple250'
	| 'Purple300'
	| 'Purple400'
	| 'Purple500'
	| 'Purple600'
	| 'Purple700'
	| 'Purple800'
	| 'Purple850'
	| 'Purple900'
	| 'Purple1000'
	| 'Teal100'
	| 'Teal200'
	| 'Teal250'
	| 'Teal300'
	| 'Teal400'
	| 'Teal500'
	| 'Teal600'
	| 'Teal700'
	| 'Teal800'
	| 'Teal850'
	| 'Teal900'
	| 'Teal1000'
	| 'Orange100'
	| 'Orange200'
	| 'Orange250'
	| 'Orange300'
	| 'Orange400'
	| 'Orange500'
	| 'Orange600'
	| 'Orange700'
	| 'Orange800'
	| 'Orange850'
	| 'Orange900'
	| 'Orange1000'
	| 'Magenta100'
	| 'Magenta200'
	| 'Magenta250'
	| 'Magenta300'
	| 'Magenta400'
	| 'Magenta500'
	| 'Magenta600'
	| 'Magenta700'
	| 'Magenta800'
	| 'Magenta850'
	| 'Magenta900'
	| 'Magenta1000'
	| 'Lime100'
	| 'Lime200'
	| 'Lime250'
	| 'Lime300'
	| 'Lime400'
	| 'Lime500'
	| 'Lime600'
	| 'Lime700'
	| 'Lime800'
	| 'Lime850'
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
				value: '#E9F2FE',
				attributes: {
					group: 'palette',
					category: 'blue',
				},
			},
			Blue200: {
				value: '#CFE1FD',
				attributes: {
					group: 'palette',
					category: 'blue',
				},
			},
			Blue250: {
				value: '#ADCBFB',
				attributes: {
					group: 'palette',
					category: 'blue',
				},
			},
			Blue300: {
				value: '#8FB8F6',
				attributes: {
					group: 'palette',
					category: 'blue',
				},
			},
			Blue400: {
				value: '#669DF1',
				attributes: {
					group: 'palette',
					category: 'blue',
				},
			},
			Blue500: {
				value: '#4688EC',
				attributes: {
					group: 'palette',
					category: 'blue',
				},
			},
			Blue600: {
				value: '#357DE8',
				attributes: {
					group: 'palette',
					category: 'blue',
				},
			},
			Blue700: {
				value: '#1868DB',
				attributes: {
					group: 'palette',
					category: 'blue',
				},
			},
			Blue800: {
				value: '#1558BC',
				attributes: {
					group: 'palette',
					category: 'blue',
				},
			},
			Blue850: {
				value: '#144794',
				attributes: {
					group: 'palette',
					category: 'blue',
				},
			},
			Blue900: {
				value: '#123263',
				attributes: {
					group: 'palette',
					category: 'blue',
				},
			},
			Blue1000: {
				value: '#1C2B42',
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
			Red250: {
				value: '#FFB8B2',
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
			Red850: {
				value: '#872821',
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
				value: '#FEF7C8',
				attributes: {
					group: 'palette',
					category: 'yellow',
				},
			},
			Yellow200: {
				value: '#F5E989',
				attributes: {
					group: 'palette',
					category: 'yellow',
				},
			},
			Yellow250: {
				value: '#EFDD4E',
				attributes: {
					group: 'palette',
					category: 'yellow',
				},
			},
			Yellow300: {
				value: '#EED12B',
				attributes: {
					group: 'palette',
					category: 'yellow',
				},
			},
			Yellow400: {
				value: '#DDB30E',
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
			Yellow850: {
				value: '#614A05',
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
			Green250: {
				value: '#97EDC9',
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
			Green850: {
				value: '#19573D',
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
				value: '#F8EEFE',
				attributes: {
					group: 'palette',
					category: 'purple',
				},
			},
			Purple200: {
				value: '#EED7FC',
				attributes: {
					group: 'palette',
					category: 'purple',
				},
			},
			Purple250: {
				value: '#E3BDFA',
				attributes: {
					group: 'palette',
					category: 'purple',
				},
			},
			Purple300: {
				value: '#D8A0F7',
				attributes: {
					group: 'palette',
					category: 'purple',
				},
			},
			Purple400: {
				value: '#C97CF4',
				attributes: {
					group: 'palette',
					category: 'purple',
				},
			},
			Purple500: {
				value: '#BF63F3',
				attributes: {
					group: 'palette',
					category: 'purple',
				},
			},
			Purple600: {
				value: '#AF59E1',
				attributes: {
					group: 'palette',
					category: 'purple',
				},
			},
			Purple700: {
				value: '#964AC0',
				attributes: {
					group: 'palette',
					category: 'purple',
				},
			},
			Purple800: {
				value: '#803FA5',
				attributes: {
					group: 'palette',
					category: 'purple',
				},
			},
			Purple850: {
				value: '#673286',
				attributes: {
					group: 'palette',
					category: 'purple',
				},
			},
			Purple900: {
				value: '#48245D',
				attributes: {
					group: 'palette',
					category: 'purple',
				},
			},
			Purple1000: {
				value: '#35243F',
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
			Teal250: {
				value: '#B1E4F7',
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
			Teal850: {
				value: '#1A5265',
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
				value: '#FFF5DB',
				attributes: {
					group: 'palette',
					category: 'orange',
				},
			},
			Orange200: {
				value: '#FCE4A6',
				attributes: {
					group: 'palette',
					category: 'orange',
				},
			},
			Orange250: {
				value: '#FBD779',
				attributes: {
					group: 'palette',
					category: 'orange',
				},
			},
			Orange300: {
				value: '#FBC828',
				attributes: {
					group: 'palette',
					category: 'orange',
				},
			},
			Orange400: {
				value: '#FCA700',
				attributes: {
					group: 'palette',
					category: 'orange',
				},
			},
			Orange500: {
				value: '#F68909',
				attributes: {
					group: 'palette',
					category: 'orange',
				},
			},
			Orange600: {
				value: '#E06C00',
				attributes: {
					group: 'palette',
					category: 'orange',
				},
			},
			Orange700: {
				value: '#BD5B00',
				attributes: {
					group: 'palette',
					category: 'orange',
				},
			},
			Orange800: {
				value: '#9E4C00',
				attributes: {
					group: 'palette',
					category: 'orange',
				},
			},
			Orange850: {
				value: '#7A3B00',
				attributes: {
					group: 'palette',
					category: 'orange',
				},
			},
			Orange900: {
				value: '#693200',
				attributes: {
					group: 'palette',
					category: 'orange',
				},
			},
			Orange1000: {
				value: '#3A2C1F',
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
			Magenta250: {
				value: '#FCB6E1',
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
			Magenta850: {
				value: '#77325B',
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
			Lime250: {
				value: '#BDE97C',
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
			Lime850: {
				value: '#3F5224',
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
				value: '#111213',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			'DarkNeutral-100A': {
				// #010404 46%
				value: '#01040475',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral0: {
				value: '#18191A',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral100: {
				value: '#1F1F21',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral100A: {
				// #BDBDBD 4%
				value: '#BDBDBD0A',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral200: {
				value: '#242528',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral200A: {
				// #CECED9 7%
				value: '#CECED912',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral250: {
				value: '#2B2C2F',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral250A: {
				// #D9DAE7 10%
				value: '#D9DAE71A',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral300: {
				value: '#303134',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral300A: {
				// #E3E4F2 12%
				value: '#E3E4F21F',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral350: {
				value: '#3D3F43',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral350A: {
				// #E8EDFD 18%
				value: '#E8EDFD2E',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral400: {
				value: '#4B4D51',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral400A: {
				// #E5E9F6 25%
				value: '#E5E9F640',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral500: {
				value: '#63666B',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral500A: {
				// #E9F0FB 36%
				value: '#E9F0FB5C',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral600: {
				value: '#7E8188',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral700: {
				value: '#96999E',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral800: {
				value: '#A9ABAF',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral900: {
				value: '#BFC1C4',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral1000: {
				value: '#CECFD2',
				attributes: {
					group: 'palette',
					category: 'dark mode neutral',
				},
			},
			DarkNeutral1100: {
				value: '#E2E3E4',
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
				value: '#F8F8F8',
				attributes: {
					group: 'palette',
					category: 'light mode neutral',
				},
			},
			Neutral100A: {
				// #171717 3%
				value: '#17171708',
				attributes: {
					group: 'palette',
					category: 'light mode neutral',
				},
			},
			Neutral200: {
				value: '#F0F1F2',
				attributes: {
					group: 'palette',
					category: 'light mode neutral',
				},
			},
			Neutral200A: {
				// #051524 6%
				value: '#0515240F',
				attributes: {
					group: 'palette',
					category: 'light mode neutral',
				},
			},
			Neutral300: {
				value: '#DDDEE1',
				attributes: {
					group: 'palette',
					category: 'light mode neutral',
				},
			},
			Neutral300A: {
				// #0B120E 14%
				value: '#0B120E24',
				attributes: {
					group: 'palette',
					category: 'light mode neutral',
				},
			},
			Neutral400: {
				value: '#B7B9BE',
				attributes: {
					group: 'palette',
					category: 'light mode neutral',
				},
			},
			Neutral400A: {
				// #080F21 29%
				value: '#080F214A',
				attributes: {
					group: 'palette',
					category: 'light mode neutral',
				},
			},
			Neutral500: {
				value: '#8C8F97',
				attributes: {
					group: 'palette',
					category: 'light mode neutral',
				},
			},
			Neutral500A: {
				// #050C1F 46%
				value: '#050C1F75',
				attributes: {
					group: 'palette',
					category: 'light mode neutral',
				},
			},
			Neutral600: {
				value: '#7D818A',
				attributes: {
					group: 'palette',
					category: 'light mode neutral',
				},
			},
			Neutral700: {
				value: '#6B6E76',
				attributes: {
					group: 'palette',
					category: 'light mode neutral',
				},
			},
			Neutral800: {
				value: '#505258',
				attributes: {
					group: 'palette',
					category: 'light mode neutral',
				},
			},
			Neutral900: {
				value: '#3B3D42',
				attributes: {
					group: 'palette',
					category: 'light mode neutral',
				},
			},
			Neutral1000: {
				value: '#292A2E',
				attributes: {
					group: 'palette',
					category: 'light mode neutral',
				},
			},
			Neutral1100: {
				value: '#1E1F21',
				attributes: {
					group: 'palette',
					category: 'light mode neutral',
				},
			},
		},
	},
};

export default palette;
