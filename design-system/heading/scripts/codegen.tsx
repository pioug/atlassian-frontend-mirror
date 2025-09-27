import { writeFileSync } from 'fs';
import { join } from 'path';

import format from '@af/formatting/sync';
import tokenNames from '@atlaskit/tokens/token-names';
// eslint-disable-next-line import/order
import { createPartialSignedArtifact } from '@atlassian/codegen';

// eslint-disable-next-line import/order
import { typographyAdg3 as tokens } from '@atlaskit/tokens/tokens-raw';

const constructTokenFunctionCall = (tokenName: string) => {
	return `token('${tokenName}')`;
};

const headingTokens = tokens
	.filter((t) => t.attributes.group === 'typography')
	.filter((t) => t.cleanName.includes('heading'));

const removeVerbosity = (name: string): string => {
	return name.replace('font.heading.', '');
};

export const createTypographyStylesFromTemplate = () => {
	const tokenTypes = headingTokens
		.map((token) => {
			return `
	readonly ${removeVerbosity(token.name)}: CompiledStyles<{
		font: "var(${tokenNames[token.name as keyof typeof tokenNames]})";
	}>;`.trim();
		})
		.join('\n\t');

	return (
		format(
			`
const headingSizeStylesMap: {
	${tokenTypes}
} = cssMap({
  ${headingTokens
		.map((token) => {
			return `
        '${removeVerbosity(token.name)}': { font: ${constructTokenFunctionCall(token.cleanName)} }
      `.trim();
		})
		.join(',\n\t')}
	});`,
			'typescript',
		) + `\ntype HeadingSize = keyof typeof headingSizeStylesMap;\n`
	);
};

const targetPath = join(__dirname, '../', 'src', 'heading.partial.tsx');

writeFileSync(
	join(__dirname, '../src/heading.partial.tsx'),
	createPartialSignedArtifact(
		createTypographyStylesFromTemplate(),
		'yarn workspace @atlaskit/heading codegen',
		{
			id: 'typography',
			absoluteFilePath: targetPath,
		},
	),
);
