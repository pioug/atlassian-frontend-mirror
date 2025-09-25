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

export const createSpacingStylesFromTemplate = (): string => {
	const typeAndValuePositive = positiveSpaceTokens
		.map(({ name, fallback }) => `'${fallback}': '${name}',`)
		.join('\t\n');
	const typePositiveUnionKeys = positiveSpaceTokens
		.map(({ fallback }) => `'${fallback}'`)
		.join(' | ');

	const typeAndValueNegative = negativeSpaceTokens
		.map(({ name, fallback }) => `'${fallback}': '${name}',`)
		.join('\t\n');
	const typeNegativeUnionKeys = negativeSpaceTokens
		.map(({ fallback }) => `'${fallback}'`)
		.join(' | ');

	const output = [
		`export const positiveSpaceMap: {
			${typeAndValuePositive}
		} = {\n${typeAndValuePositive}}`,
		`export type Space = ${typePositiveUnionKeys};\n`,
		`export const negativeSpaceMap: {
			${typeAndValueNegative}
		} = {\n${typeAndValueNegative}}`,
		`export type NegativeSpace = ${typeNegativeUnionKeys};\n`,
		`export const allSpaceMap: {
			${[typeAndValuePositive, typeAndValueNegative].join('\t\n')}
		} = { ...positiveSpaceMap, ...negativeSpaceMap };\n`,
		`export type AllSpace = ${[typePositiveUnionKeys, typeNegativeUnionKeys].join(' | ')};\n`,
	].join('\t\n');

	return format(output, 'typescript');
};
