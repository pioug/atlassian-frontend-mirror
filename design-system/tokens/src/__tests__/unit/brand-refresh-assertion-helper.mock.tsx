import { type ThemeIdsWithOverrides } from '../../theme-config';

const backgroundSuccessRegex = /--ds-background-success:\s*([^;]+);/;

export const mainThemes: ThemeIdsWithOverrides[] = ['light', 'dark'];

export const verifyBrandRefreshColors = (css: string, id: ThemeIdsWithOverrides) => {
	switch (id) {
		case 'light': {
			verifyLightColor(css);
			break;
		}
		case 'dark': {
			verifyDarkColor(css);
			break;
		}
		default:
			throw new Error(`Theme ${id} not supported`);
	}
};

export const verifyLightColor = (css: string) => verifyColors(css, '#EFFFD6');
export const verifyDarkColor = (css: string) => verifyColors(css, '#28311B');

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
