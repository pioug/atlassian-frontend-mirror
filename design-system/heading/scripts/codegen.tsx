import { writeFileSync } from 'fs';
import { join } from 'path';

import format from '@af/formatting/sync';
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
	return (
		format(
			`
const headingSizeStylesMap = {
  ${headingTokens
		.map((token) => {
			return `
        '${removeVerbosity(
					token.name,
				)}': css({ font: ${constructTokenFunctionCall(token.cleanName)} })
      `.trim();
		})
		.join(',\n\t')}
};`,
			'typescript',
		) + `\nexport type HeadingSize = keyof typeof headingSizeStylesMap;\n`
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
