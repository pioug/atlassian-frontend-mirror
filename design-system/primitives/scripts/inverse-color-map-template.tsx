import format from '@af/formatting/sync';
import tokens from '@atlaskit/tokens/atlassian-light';

import { compose } from './compose';
import { filterTokensForCodegen, type TokenFilterOptions } from './filter-tokens-for-codegen';
import { isAccent } from './is-accent';
import { pick } from './pick';
import { not } from './utils';

type Token = {
	attributes: { state: string };
	token: string;
	fallback: string;
};

const activeTokens = tokens
	.filter((t) => t.attributes.state !== 'deleted' && t.attributes.state !== 'deprecated')
	.map((t): Token => ({
		attributes: t.attributes,
		token: t.name,
		fallback: t.value as string,
	}))
	.filter(compose(pick('token'), not(isAccent)))
	.filter((t) => t.token.includes('background'))
	.filter((t) => t.token.includes('bold'))
	// @ts-ignore
	.map((t) => ({ ...t, token: t.token.replaceAll('.[default]', '') }));

export const createInverseColorMapTemplate: (options?: TokenFilterOptions) => string = (
	options = {},
) => {
	const filteredTokens = filterTokensForCodegen(activeTokens, options);
	const propMap = filteredTokens.map((t) => {
		// handle the default case eg color.border or color.text
		const propName = t.token;
		return `'${propName}': '${
			propName.includes('warning') ? 'color.text.warning.inverse' : 'color.text.inverse'
		}'`;
	});
	return format(
		`
export const inverseColorMap: {
	${propMap.join(';\n\t')}
} = {
  ${propMap.join(',\n\t')}
} as const;`,
		'typescript',
	);
};
