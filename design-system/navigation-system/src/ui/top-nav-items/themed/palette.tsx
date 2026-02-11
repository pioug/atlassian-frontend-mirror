/**
 * Copied from the brand refresh palette.
 *
 * Ideally we'd codegen this but the brand refresh palette isn't exposed
 * through public API and we shouldn't use the private API of another package.
 */
export const palette: {
    'DarkNeutral-100': string;
    'DarkNeutral-100A': string;
    DarkNeutral0: string;
    DarkNeutral100: string;
    DarkNeutral100A: string;
    DarkNeutral200: string;
    DarkNeutral200A: string;
    DarkNeutral250: string;
    DarkNeutral250A: string;
    DarkNeutral300: string;
    DarkNeutral300A: string;
    DarkNeutral350: string;
    DarkNeutral350A: string;
    DarkNeutral400: string;
    DarkNeutral400A: string;
    DarkNeutral500: string;
    DarkNeutral500A: string;
    DarkNeutral600: string;
    DarkNeutral700: string;
    DarkNeutral800: string;
    DarkNeutral900: string;
    DarkNeutral1000: string;
    DarkNeutral1100: string;
    Neutral0: string;
    Neutral100: string;
    Neutral100A: string;
    Neutral200: string;
    Neutral200A: string;
    Neutral300: string;
    Neutral300A: string;
    Neutral400: string;
    Neutral400A: string;
    Neutral500: string;
    Neutral500A: string;
    Neutral600: string;
    Neutral700: string;
    Neutral800: string;
    Neutral900: string;
    Neutral1000: string;
    Neutral1100: string;
} = {
	'DarkNeutral-100': '#111213',
	'DarkNeutral-100A': '#01040475',
	DarkNeutral0: '#18191A',
	DarkNeutral100: '#1F1F21',
	DarkNeutral100A: '#BDBDBD0A',
	DarkNeutral200: '#242528',
	DarkNeutral200A: '#CECED912',
	DarkNeutral250: '#2B2C2F',
	DarkNeutral250A: '#D9DAE71A',
	DarkNeutral300: '#303134',
	DarkNeutral300A: '#E3E4F21F',
	DarkNeutral350: '#3D3F43',
	DarkNeutral350A: '#E8EDFD2E',
	DarkNeutral400: '#4B4D51',
	DarkNeutral400A: '#E5E9F640',
	DarkNeutral500: '#63666B',
	DarkNeutral500A: '#E9F0FB5C',
	DarkNeutral600: '#7E8188',
	DarkNeutral700: '#96999E',
	DarkNeutral800: '#A9ABAF',
	DarkNeutral900: '#BFC1C4',
	DarkNeutral1000: '#CECFD2',
	DarkNeutral1100: '#E2E3E4',
	Neutral0: '#FFFFFF',
	Neutral100: '#F8F8F8',
	Neutral100A: '#17171708',
	Neutral200: '#F0F1F2',
	Neutral200A: '#0515240F',
	Neutral300: '#DDDEE1',
	Neutral300A: '#0B120E24',
	Neutral400: '#B7B9BE',
	Neutral400A: '#080F214A',
	Neutral500: '#8C8F97',
	Neutral500A: '#050C1F75',
	Neutral600: '#7D818A',
	Neutral700: '#6B6E76',
	Neutral800: '#505258',
	Neutral900: '#3B3D42',
	Neutral1000: '#292A2E',
	Neutral1100: '#1E1F21',
};

export const paletteRgba: {
    DarkNeutral300A: {
        r: number;
        g: number;
        b: number;
        a: number;
    };
    Neutral300A: {
        r: number;
        g: number;
        b: number;
        a: number;
    };
} = {
	DarkNeutral300A: { r: 0xe3, g: 0xe4, b: 0xf2, a: 0x1f / 255 },
	Neutral300A: { r: 0x0b, g: 0x12, b: 0x0e, a: 0x24 / 255 },
};
