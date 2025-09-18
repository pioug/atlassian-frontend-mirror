import format from '@af/formatting/sync';
import { spacing as tokens } from '@atlaskit/tokens/tokens-raw';

import { constructTokenFunctionCall, generateTypeDefs } from './utils';

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
		`export const positiveSpaceMap: {
			${generateTypeDefs(positiveSpaceTokens.map((t) => t.name))}
		} = {\n${positiveSpaceTokens
			.map(({ name, fallback }) => `'${name}': ${constructTokenFunctionCall(name, fallback)},`)
			.join('\n')}}`,
		`export type Space = keyof typeof positiveSpaceMap;\n`,
		`export const negativeSpaceMap: {
			${generateTypeDefs(negativeSpaceTokens.map((t) => t.name))}
		} = {\n${negativeSpaceTokens
			.map(({ name, fallback }) => `'${name}': ${constructTokenFunctionCall(name, fallback)},`)
			.join('\n')}}`,
		`export type NegativeSpace = keyof typeof negativeSpaceMap;\n`,
		`export const allSpaceMap: {
			${generateTypeDefs(positiveSpaceTokens.map((t) => t.name))}
			${generateTypeDefs(negativeSpaceTokens.map((t) => t.name))}
		} = { ...positiveSpaceMap, ...negativeSpaceMap };\n`,
		`export type AllSpace = keyof typeof allSpaceMap;\n`,
	].join('\n');

	return format(output, 'typescript');
};
