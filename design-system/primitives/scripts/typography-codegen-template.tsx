import format from '@af/formatting/sync';
import tokens from '@atlaskit/tokens/atlassian-typography';

import { capitalize } from './capitalize';
import { filterTokensForCodegen, type TokenFilterOptions } from './filter-tokens-for-codegen';
import { generateTypeDefs } from './generate-type-defs';
import { constructTokenFunctionCall } from './utils';

type Token = {
	attributes: { state: string };
	name: string;
	fallback: string;
	isDeprecated: boolean;
};

type TypographyProperty = 'font' | 'fontWeight' | 'fontFamily';

type TypographyPropertyConfig = {
	objectName: string;
	cssProperty: string;
	prefix: string;
	filterFn: (token: Token) => boolean;
};

const activeTokens: Token[] = tokens
	.filter((t) => t.attributes.state !== 'deleted')
	.map((t) => ({
		attributes: t.attributes,
		name: t.name,
		fallback: t.value,
		isDeprecated: t.attributes.state === 'deprecated',
	}));

const typographyProperties: Record<TypographyProperty, TypographyPropertyConfig> = {
	font: {
		objectName: 'font',
		cssProperty: 'font',
		prefix: 'font.body',
		filterFn: (t: Token): boolean =>
			t.name.startsWith('font.body') ||
			t.name.startsWith('font.heading') ||
			t.name.startsWith('font.metric') ||
			t.name.startsWith('font.code'),
	},
	fontWeight: {
		objectName: 'fontWeight',
		cssProperty: 'fontWeight',
		prefix: 'font.weight.',
		filterFn: (t: Token): boolean => t.name.startsWith('font.weight'),
	},
	fontFamily: {
		objectName: 'fontFamily',
		cssProperty: 'fontFamily',
		prefix: 'font.family.',
		filterFn: (t: Token): boolean => t.name.startsWith('font.family'),
	},
};

export const createTypographyStylesFromTemplate: (
	property: TypographyProperty,
	options?: TokenFilterOptions,
) => string = (property, options = {}) => {
	const filteredTokens = filterTokensForCodegen(activeTokens, options);
	if (!typographyProperties[property]) {
		throw new Error(`[codegen] Unknown option found "${property}"`);
	}

	const { filterFn, objectName } = typographyProperties[property];

	return (
		format(
			`
export const ${objectName}Map: {
	${generateTypeDefs(
		filteredTokens
			.filter(filterFn)
			.map((t) => t.name.replace(/\.\[default\]/g, ''))
			.sort((a, b) => (a < b ? -1 : 1)),
	)}
} = {
${filteredTokens
	.filter(filterFn)
	.map((t) => ({ ...t, name: t.name.replace(/\.\[default\]/g, '') }))
	.sort((a, b) => (a.name < b.name ? -1 : 1))
	.map((token) => {
		return `
			${token.isDeprecated ? '// @deprecated' : ''}
			'${token.name}': ${constructTokenFunctionCall(token.name, token.fallback)}
		`.trim();
	})
	.join(',\n\t')}
};`,
			'typescript',
		) + `\nexport type ${capitalize(objectName)} = keyof typeof ${objectName}Map;\n`
	);
};
