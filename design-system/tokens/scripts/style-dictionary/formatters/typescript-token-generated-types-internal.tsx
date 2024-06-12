import type { Format } from 'style-dictionary';

import format from '@af/formatting/sync';
import { createSignedArtifact } from '@atlassian/codegen';

import { getFullyQualifiedTokenId } from '../../../src/utils/token-ids';
import sortTokens from '../sort-tokens';

export const typescriptFormatter: Format['formatter'] = ({ dictionary }) => {
	const activeTokens: string[] = [];

	sortTokens(
		dictionary.allTokens.filter(
			(token) => token.attributes?.group !== 'palette' && token.attributes?.state === 'active',
		),
	).forEach((token) => activeTokens.push(getFullyQualifiedTokenId(token.path)));

	if (activeTokens.length) {
		const activeTokenType = activeTokens.map((value) => ` | '${value}'`).join('\n');

		return format(`export type InternalTokenIds = ${activeTokenType};\n`, 'typescript');
	}

	return `// No active tokens in this theme\nexport {}`;
};

const fileFormatter: Format['formatter'] = (args) =>
	createSignedArtifact(typescriptFormatter(args), `yarn build tokens`);

export default fileFormatter;
