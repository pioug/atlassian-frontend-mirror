// eslint-disable-next-line import/no-extraneous-dependencies
import format from '@af/formatting/sync';
import { typography as tokens } from '@atlaskit/tokens/tokens-raw';

import { capitalize } from './capitalize';
import { generateTypeDefs } from './generate-type-defs';
import { constructTokenFunctionCall } from './utils';

type Token = {
	name: string;
	fallback: string;
};

type TextProperty = 'textSize' | 'textWeight' | 'metricTextSize';

type TextPropertyConfig = {
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
	}));

const textProperties: Record<TextProperty, TextPropertyConfig> = {
	textSize: {
		objectName: 'textSize',
		cssProperty: 'font',
		prefix: 'font.body',
		filterFn: (t: Token): boolean => t.name.startsWith('font.body'),
	},
	textWeight: {
		objectName: 'textWeight',
		cssProperty: 'fontWeight',
		prefix: 'font.weight.',
		filterFn: (t: Token): boolean => t.name.startsWith('font.weight'),
	},
	metricTextSize: {
		objectName: 'metricTextSize',
		cssProperty: 'font',
		prefix: 'font.metric',
		filterFn: (t: Token): boolean => t.name.startsWith('font.metric'),
	},
};

const sizeMap = {
	'body.small': 'small',
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

export const createTextStylesFromTemplate: (property: TextProperty) => string = (property) => {
	if (!textProperties[property]) {
		throw new Error(`[codegen] Unknown option found "${property}"`);
	}

	const { filterFn, objectName } = textProperties[property];

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
};
