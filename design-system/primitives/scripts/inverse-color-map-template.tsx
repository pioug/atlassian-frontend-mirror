import format from '@af/formatting/sync';
import tokens from '@atlaskit/tokens/atlassian-light';

import { compose } from './compose';
import { isAccent } from './is-accent';
import { pick } from './pick';
import { not } from './utils';

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

export const createInverseColorMapTemplate: () => string = () => {
	const propMap = activeTokens.map((t) => {
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
