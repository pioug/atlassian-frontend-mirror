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

const textProperties = [
	{
		objectName: 'textSize',
		cssProperty: 'font',
		prefix: 'font.body',
		filterFn: <T extends Token>(t: T) => t.name.startsWith('font.body'),
	},
	{
		objectName: 'textWeight',
		cssProperty: 'fontWeight',
		prefix: 'font.weight.',
		filterFn: <T extends Token>(t: T) => t.name.startsWith('font.weight'),
	},
	{
		objectName: 'metricTextSize',
		cssProperty: 'font',
		prefix: 'font.metric',
		filterFn: <T extends Token>(t: T) => t.name.startsWith('font.metric'),
	},
] as const;

const sizeMap = {
	'body.small': 'small',
	'body.UNSAFE_small': 'UNSAFE_small',
	body: 'medium',
	'body.large': 'large',
	'metric.small': 'small',
	'metric.medium': 'medium',
	'metric.large': 'large',
};

const removeVerbosity = (name: string): string => {
	const partialRemove = ['font.body', 'font.metric'];
	if (partialRemove.some((s) => name.includes(s))) {
		// @ts-expect-error Indexing sizeMap
		return sizeMap[name.replace('font.', '')];
	}

	const fullRemove = ['font.weight'];
	const removeIndex = fullRemove.findIndex((s) => name.includes(s));
	if (removeIndex > -1) {
		return name.replace(`${fullRemove[removeIndex]}.`, '');
	}

	return name;
};

export const createTextStylesFromTemplate = () => {
	return textProperties
		.map((textProperty) => {
			const { filterFn, objectName } = textProperty;

			const tokenNames = activeTokens
				.filter(filterFn)
				.map((t) => t.name.replace(/\.\[default\]/g, ''))
				.sort((a, b) => (a < b ? -1 : 1));

			return (
				format(
					`
	export const ${objectName}Map: {
		${generateTypeDefs(
			tokenNames,
			tokenNames.map((token) => removeVerbosity(token)),
		)}
	} = {
	${activeTokens
		.filter(filterFn)
		.map((t) => ({ ...t, name: t.name.replace(/\.\[default\]/g, '') }))
		.sort((a, b) => (a.name < b.name ? -1 : 1))
		.map((token) => {
			return `
				'${removeVerbosity(token.name)}': ${constructTokenFunctionCall(token.name, token.fallback)}
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
