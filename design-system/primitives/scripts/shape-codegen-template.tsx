import format from '@af/formatting/sync';
import { shape as shapeTokens } from '@atlaskit/tokens/tokens-raw';

import { capitalize, constructTokenFunctionCall, generateTypeDefs } from './utils';

type Token = {
	token: string;
	fallback: string;
	isDeprecated: boolean;
};

const tokenStyles = {
	width: {
		objectName: 'borderWidth',
		filterPrefix: 'border.width',
		cssProperty: 'borderWidth',
		filterFn: <T extends Token>(t: T) =>
			t.token.startsWith(tokenStyles.width.filterPrefix) && !t.isDeprecated,
	},
	radius: {
		objectName: 'borderRadius',
		filterPrefix: 'radius',
		cssProperty: 'borderRadius',
		filterFn: <T extends Token>(t: T) => t.token.startsWith(tokenStyles.radius.filterPrefix),
	},
} as const;

const activeTokens = shapeTokens
	.filter((t) => t.attributes.state !== 'deleted')
	.map(
		(t): Token => ({
			token: t.cleanName,
			fallback: t.value === '4px' ? '3px' : (t.value as string),
			isDeprecated: t.attributes.state === 'deprecated',
		}),
	);

export const createShapeStylesFromTemplate = (property: keyof typeof tokenStyles): string => {
	if (!tokenStyles[property]) {
		throw new Error(`[codegen] Unknown option found "${property}"`);
	}

	const { filterFn, objectName } = tokenStyles[property];

	return (
		format(
			`
export const ${objectName}Map: {
			${generateTypeDefs(activeTokens.filter(filterFn).map((t) => t.token))}
} = {
  ${activeTokens
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
