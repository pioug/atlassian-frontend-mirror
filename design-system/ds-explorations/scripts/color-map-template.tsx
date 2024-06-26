import format from '@af/formatting/sync';
import { light as tokens } from '@atlaskit/tokens/tokens-raw';

import { compose, isAccent, not, pick } from './utils';

type Token = {
	token: string;
	fallback: string;
};

const activeTokens = tokens
	.filter((t) => t.attributes.state !== 'deleted' && t.attributes.state !== 'deprecated')
	.map(
		(t): Token => ({
			token: t.name,
			fallback: t.value as string,
		}),
	)
	.filter(compose(pick('token'), not(isAccent)))
	.filter((t) => t.token.includes('background'))
	.filter((t) => t.token.includes('bold'))
	// @ts-ignore
	.map((t) => ({ ...t, token: t.token.replaceAll('.[default]', '') }));

export const createColorMapTemplate = () => {
	return format(
		`
export default {
  ${activeTokens
		.map((t) => {
			// handle the default case eg color.border or color.text
			const propName = t.token.replace('color.background.', '');
			return `'${propName}': '${propName.includes('warning') ? 'warning.inverse' : 'inverse'}'`;
		})
		.join(',\n\t')}
} as const;`,
		'typescript',
	);
};
