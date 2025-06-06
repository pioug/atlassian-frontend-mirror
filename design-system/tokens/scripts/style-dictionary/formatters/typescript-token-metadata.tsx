import type { Format } from 'style-dictionary';

import format from '@af/formatting/sync';
import { createSignedArtifact } from '@atlassian/codegen';

import { getTokenId } from '../../../src/utils/token-ids';

const formatter: Format['formatter'] = ({ dictionary }) => {
	const tokens = dictionary.allTokens.filter((token) => {
		const attributes = token.attributes || {};
		const isToken = attributes.group !== 'palette';
		const isPublicToken = attributes.state !== 'experimental' && attributes.state !== 'deleted';

		return isToken && isPublicToken;
	});

	const source = format(
		`export interface Token {
	name: string;
	path: string[];
	description: string;
	exampleValue?: string | number;
}

export const tokens: Token[] = [
	${tokens
		.map((token) => ({
			name: getTokenId(token.path),
			path: token.path,
			description: token.attributes?.description,
			exampleValue: token.value,
		}))
		.map((token) => JSON.stringify(token))
		.join(',\n')}
];
`,
		'typescript',
	);

	return createSignedArtifact(
		source,
		`yarn build tokens`,
		`Metadata for generation of of \`@atlaskit/ads-mcp\` and https://atlassian.design/llms-tokens.txt.`,
	);
};

export default formatter;
