import format from '@af/formatting/sync';
import { typographyAdg3 as tokens } from '@atlaskit/tokens/tokens-raw';

import { capitalize, constructTokenFunctionCall, generateTypeDefs } from './utils';

type Token = {
	name: string;
	fallback: string;
};

const activeTokens: Token[] = tokens
	.filter((t) => t.attributes.state === 'active')
	.map((t) => ({
		name: t.name,
		fallback: t.value,
	}));

const typographyProperties = [
	{
		objectName: 'font',
		cssProperty: 'font',
		prefix: 'font.body',
		filterFn: <T extends Token>(t: T) =>
			t.name.startsWith('font.body') ||
			t.name.startsWith('font.heading') ||
			t.name.startsWith('font.metric') ||
			t.name.startsWith('font.code'),
	},
	{
		objectName: 'fontWeight',
		cssProperty: 'fontWeight',
		prefix: 'font.weight.',
		filterFn: <T extends Token>(t: T) => t.name.startsWith('font.weight'),
	},
	{
		objectName: 'fontFamily',
		cssProperty: 'fontFamily',
		prefix: 'font.family.',
		filterFn: <T extends Token>(t: T) => t.name.startsWith('font.family'),
	},
] as const;

export const createTypographyStylesFromTemplate = () => {
	return typographyProperties
		.map((typographyProperty) => {
			const { filterFn, objectName } = typographyProperty;

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
      '${token.name}': ${constructTokenFunctionCall(token.name, token.fallback)}
    `.trim();
	})
	.join(',\n\t')}
};`,
					'typescript',
				) + `\nexport type ${capitalize(objectName)} = keyof typeof ${objectName}Map;\n`
			);
		})
		.join('\n');
};
