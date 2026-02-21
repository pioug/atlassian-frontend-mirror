/* eslint-disable no-console */
import { writeFileSync } from 'fs';
import { join } from 'path';

import { createPartialSignedArtifact } from '@atlassian/codegen';

import { createSpacingStylesFromTemplate } from './spacing-codegen-template';

const spacingTokensDependencyPath =
	require.resolve('../../../tokens/src/artifacts/tokens-raw/atlassian-spacing');

const targetPath = join(__dirname, '../', '../', 'src', 'common', 'token-maps.partial.tsx');

// For now this only supporting mapping spacing tokens,
// because we can't make assumptions when mapping others
// like colors which have more semantic meaning.
// It may be extended to other suitable tokens (like shape tokens)
const sourceFns = [
	// padding*, gap*, inset*
	() =>
		createPartialSignedArtifact(
			createSpacingStylesFromTemplate,
			'yarn workspace @atlaskit/eslint-plugin-design-system codegen-token-maps',
			{
				id: 'spacing',
				absoluteFilePath: targetPath,
				dependencies: [spacingTokensDependencyPath],
			},
		),
];

sourceFns.forEach((sourceFn) => {
	writeFileSync(targetPath, sourceFn());
});

console.log(`${targetPath} written!`);
