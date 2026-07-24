// eslint-disable-next-line import/no-extraneous-dependencies
import format from '@af/formatting/sync';
import { spacing as tokens } from '@atlaskit/tokens/tokens-raw';

import { generateTypeDefs } from './generate-type-defs';
import { constructTokenFunctionCall } from './utils';

type SpacingToken = {
	name: string;
	fallback: string;
};

type SpacingProperty = 'positive' | 'negative' | 'all';

type SpacingPropertyConfig = {
	objectName: string;
	typeName: string;
	tokens: SpacingToken[];
};

const spacingTokenPrefix = 'space.';
const negativeSuffix = '.negative';
const positiveSpaceTokens: SpacingToken[] = tokens
	.filter((token) => token.name.startsWith(spacingTokenPrefix))
	.filter((token) => !token.name.includes(negativeSuffix))
	.map((t) => ({
		name: t.cleanName, // Need to use cleanName to avoid getting '[default]' in the token names
		fallback: t.value,
	}));

const negativeSpaceTokens: SpacingToken[] = tokens
	.filter((token) => token.name.startsWith(spacingTokenPrefix))
	.filter((token) => token.name.includes(negativeSuffix))
	.map((t) => ({
		name: t.cleanName,
		fallback: t.value,
	}));

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
};

export const createSpacingStylesFromTemplate: (property: SpacingProperty) => string = (
	property,
) => {
	if (!spacingProperties[property]) {
		throw new Error(`[codegen] Unknown option found "${property}"`);
	}

	const { objectName, typeName, tokens } = spacingProperties[property];

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
