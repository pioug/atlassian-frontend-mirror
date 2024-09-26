import { type ThemeIdsWithOverrides } from '../../theme-config';

const backgroundSuccessRegex = /--ds-background-success:\s*([^;]+);/;

export const mainThemes: ThemeIdsWithOverrides[] = ['light', 'dark'];

export const verifyBrandRefreshColors = (css: string, id: ThemeIdsWithOverrides) => {
	switch (id) {
		case 'light': {
			verifyLightBrandRefershColor(css);
			break;
		}
		case 'dark': {
			verifyDarkBrandRefershColor(css);
			break;
		}
		default:
			throw new Error(`Theme ${id} not supported`);
	}
};

export const verifyNonBrandRefreshColors = (css: string, id: ThemeIdsWithOverrides) => {
	switch (id) {
		case 'light': {
			verifyLightNonBrandRefershColor(css);
			break;
		}
		case 'dark': {
			verifyDarkNonBrandRefershColor(css);
			break;
		}
		default:
			throw new Error(`Theme ${id} not supported`);
	}
};

export const verifyLightBrandRefershColor = (css: string) => verifyColors(css, '#EFFFD6');
export const verifyDarkBrandRefershColor = (css: string) => verifyColors(css, '#28311B');

export const verifyLightNonBrandRefershColor = (css: string) => verifyColors(css, '#DCFFF1');
export const verifyDarkNonBrandRefershColor = (css: string) => verifyColors(css, '#1C3329');

const verifyColors = (css: string, color: string) => {
	// Using the regular expression to match the string
	const match = css.match(backgroundSuccessRegex);
	if (match) {
		const dsBackgroundSuccessValue = match[1].trim(); // Extracting the value and trimming any whitespace
		expect(dsBackgroundSuccessValue).toBe(color);
	} else {
		throw new Error(
			`The --ds-background-success variable was not found while looking for ${color}.`,
		);
	}
};
