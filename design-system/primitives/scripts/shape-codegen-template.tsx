import format from '@af/formatting/sync';
import shapeTokens from '@atlaskit/tokens/atlassian-shape';

import { capitalize } from './capitalize';
import { filterTokensForCodegen, type TokenFilterOptions } from './filter-tokens-for-codegen';
import { generateTypeDefs } from './generate-type-defs';
import { constructTokenFunctionCall } from './utils';

type Token = {
	attributes: { state: string };
	token: string;
	fallback: string;
	isDeprecated: boolean;
};

const tokenStyles = {
	width: {
		objectName: 'borderWidth',
		filterPrefix: 'border.width',
		cssProperty: 'borderWidth',
		filterFn: <T extends Token>(t: T): boolean =>
			t.token.startsWith(tokenStyles.width.filterPrefix) && !t.isDeprecated,
	},
	radius: {
		objectName: 'borderRadius',
		filterPrefix: 'radius',
		cssProperty: 'borderRadius',
		filterFn: <T extends Token>(t: T): boolean =>
			t.token.startsWith(tokenStyles.radius.filterPrefix),
	},
} as const;

const activeTokens = shapeTokens
	.filter((t) => t.attributes.state !== 'deleted')
	.map((t): Token => ({
		attributes: t.attributes,
		token: t.cleanName,
		fallback: t.value === '4px' ? '3px' : (t.value as string),
		isDeprecated: t.attributes.state === 'deprecated',
	}));

export const createShapeStylesFromTemplate: (
	property: keyof typeof tokenStyles,
	options?: TokenFilterOptions,
) => string = (property, options = {}) => {
	const filteredTokens = filterTokensForCodegen(activeTokens, options);
	if (!tokenStyles[property]) {
		throw new Error(`[codegen] Unknown option found "${property}"`);
	}

	const { filterFn, objectName } = tokenStyles[property];

	return (
		format(
			`
export const ${objectName}Map: {
			${generateTypeDefs(filteredTokens.filter(filterFn).map((t) => t.token))}
} = {
  ${filteredTokens
		.filter(filterFn)
		.map((t) => {
			return `
        ${t.isDeprecated ? '// @deprecated' : ''}
        '${t.token}': ${constructTokenFunctionCall(t.token, t.fallback)}`.trim();
		})
		.join(',\n\t')}
}`,
			'typescript',
		) + `\nexport type ${capitalize(objectName)} = keyof typeof ${objectName}Map;\n`
	);
};
