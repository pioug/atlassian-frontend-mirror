import format from '@af/formatting/sync';
import tokens from '@atlaskit/tokens/atlassian-spacing';

import { filterTokensForCodegen, type TokenFilterOptions } from './filter-tokens-for-codegen';
import { generateTypeDefs } from './generate-type-defs';
import { constructTokenFunctionCall } from './utils';

type SpacingToken = {
	attributes: { state: string };
	name: string;
	fallback: string;
};

type SpacingProperty = 'positive' | 'negative' | 'all' | 'gap' | 'padding' | 'margin';

type SpacingPropertyConfig = {
	objectName: string;
	typeName: string;
	tokens: SpacingToken[];
};

const spacingTokenPrefix = 'space.';
const gapSuffix = '.gap';
const negativeSuffix = '.negative';
const positiveSpaceTokens: SpacingToken[] = tokens
	.filter((token) => token.name.startsWith(spacingTokenPrefix))
	.filter((token) => /^\d+$/.test(token.name.split('.')[1]))
	.map((t) => ({
		attributes: t.attributes,
		name: t.cleanName, // Need to use cleanName to avoid getting '[default]' in the token names
		fallback: t.value,
	}));

const negativeSpaceTokens: SpacingToken[] = tokens
	.filter((token) => token.name.startsWith(spacingTokenPrefix))
	.filter((token) => token.name.includes(negativeSuffix))
	.map((t) => ({
		attributes: t.attributes,
		name: t.cleanName,
		fallback: t.value,
	}));

const gapSpaceTokens: SpacingToken[] = tokens
	.filter((token) => token.name.startsWith(spacingTokenPrefix))
	.filter((token) => token.name.includes(gapSuffix))
	.map((t) => ({ attributes: t.attributes, name: t.cleanName, fallback: t.value }));

const insetSpaceTokens: SpacingToken[] = tokens
	.filter((token) => token.name.startsWith('space.inset.'))
	.map((t) => ({ attributes: t.attributes, name: t.cleanName, fallback: t.value }));

const spacingProperties: Record<SpacingProperty, SpacingPropertyConfig> = {
	positive: {
		objectName: 'positiveSpace',
		typeName: 'Space',
		tokens: positiveSpaceTokens,
	},
	negative: {
		objectName: 'negativeSpace',
		typeName: 'NegativeSpace',
		tokens: negativeSpaceTokens,
	},
	all: {
		objectName: 'allSpace',
		typeName: 'AllSpace',
		tokens: [...positiveSpaceTokens, ...negativeSpaceTokens],
	},
	margin: {
		objectName: 'marginSpace',
		typeName: 'MarginSpace',
		tokens: [...positiveSpaceTokens, ...negativeSpaceTokens, ...gapSpaceTokens],
	},
	padding: {
		objectName: 'paddingSpace',
		typeName: 'PaddingSpace',
		tokens: [...positiveSpaceTokens, ...insetSpaceTokens],
	},
	gap: {
		objectName: 'gapSpace',
		typeName: 'GapSpace',
		tokens: [...positiveSpaceTokens, ...gapSpaceTokens],
	},
};

export const createSpacingStylesFromTemplate: (
	property: SpacingProperty,
	options?: TokenFilterOptions,
) => string = (property, options = {}) => {
	if (!spacingProperties[property]) {
		throw new Error(`[codegen] Unknown option found "${property}"`);
	}

	const { objectName, typeName, tokens: sourceTokens } = spacingProperties[property];
	const tokens = filterTokensForCodegen(sourceTokens, options);

	return (
		format(
			`export const ${objectName}Map: {
	${generateTypeDefs(tokens.map(({ name }) => name))}
} = {
${tokens
	.map(({ name, fallback }) => `	'${name}': ${constructTokenFunctionCall(name, fallback)},`)
	.join('\n')}
};`,
			'typescript',
		) + `\nexport type ${typeName} = keyof typeof ${objectName}Map;\n`
	);
};
