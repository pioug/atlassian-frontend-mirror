import format from '@af/formatting/sync';
import { typography as tokens } from '@atlaskit/tokens/tokens-raw';

import { capitalize } from './capitalize';
import { generateTypeDefs } from './generate-type-defs';
import { constructTokenFunctionCall } from './utils';

type Token = {
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

export const createTypographyStylesFromTemplate: (property: TypographyProperty) => string = (
	property,
) => {
	if (!typographyProperties[property]) {
		throw new Error(`[codegen] Unknown option found "${property}"`);
	}

	const { filterFn, objectName } = typographyProperties[property];

	return (
		format(
			`
export const ${objectName}Map: {
	${generateTypeDefs(
		activeTokens
			.filter(filterFn)
			.map((t) => t.name.replace(/\.\[default\]/g, ''))
			.sort((a, b) => (a < b ? -1 : 1)),
	)}
} = {
${activeTokens
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
