import format from '@af/formatting/sync';
import { spacing as tokens } from '@atlaskit/tokens/tokens-raw';

const spacingTokenPrefix = 'space.';
const negativeSuffix = '.negative';
const positiveSpaceTokens = tokens
	.filter((token) => token.name.startsWith(spacingTokenPrefix))
	.filter((token) => !token.name.includes(negativeSuffix))
	.map((t) => ({
		name: t.cleanName, // Need to use cleanName to avoid getting '[default]' in the token names
		fallback: t.value,
	}));

const negativeSpaceTokens = tokens
	.filter((token) => token.name.startsWith(spacingTokenPrefix))
	.filter((token) => token.name.includes(negativeSuffix))
	.map((t) => ({
		name: t.cleanName,
		fallback: t.value,
	}));

export const createSpacingStylesFromTemplate = () => {
	const output = [
		`export const positiveSpaceMap = {\n${positiveSpaceTokens
			.map(({ name, fallback }) => `'${fallback}': '${name}',`)
			.join('\t\n')}}`,
		`export type Space = keyof typeof positiveSpaceMap;\n`,
		`export const negativeSpaceMap = {\n${negativeSpaceTokens
			.map(({ name, fallback }) => `'${fallback}': '${name}',`)
			.join('\t\n')}}`,
		`export type NegativeSpace = keyof typeof negativeSpaceMap;\n`,
		`export const allSpaceMap = { ...positiveSpaceMap, ...negativeSpaceMap };\n`,
		`export type AllSpace = keyof typeof allSpaceMap;\n`,
	].join('\t\n');

	return format(output, 'typescript');
};
