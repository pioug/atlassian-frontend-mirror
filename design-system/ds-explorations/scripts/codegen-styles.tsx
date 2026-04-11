/* eslint-disable no-console */
import { writeFile } from 'fs/promises';
import { join } from 'path';

import { createPartialSignedArtifact, createSignedArtifact } from '@atlassian/codegen';

import { createColorMapTemplate } from './color-map-template';
import { createInteractionStylesFromTemplate } from './interaction-codegen';

const colorMapOutputFolder = join(__dirname, '../', 'src', 'internal');
const colorTokensDependencyPath =
	require.resolve('../../tokens/src/artifacts/tokens-raw/atlassian-light');

writeFile(
	join(colorMapOutputFolder, 'color-map.tsx'),
	createSignedArtifact(createColorMapTemplate(), 'yarn codegen-styles', {
		description:
			'The color map is used to map a background color token to a matching text color that will meet contrast.',
		dependencies: [colorTokensDependencyPath],
		outputFolder: colorMapOutputFolder,
	}),
).then(() => console.log(join(colorMapOutputFolder, 'color-map.tsx')));

// generate colors
Promise.all(
	[{ target: 'interaction-surface.partial.tsx' }].map(({ target }) => {
		const targetPath = join(__dirname, '../', 'src', 'components', target);

		const source = createPartialSignedArtifact(
			(options) => options.map(createInteractionStylesFromTemplate).join('\n'),
			'yarn codegen-styles',
			{
				id: 'interactions',
				absoluteFilePath: targetPath,
				dependencies: [colorTokensDependencyPath],
			},
		);

		return writeFile(targetPath, source).then(() => console.log(`${targetPath} written!`));
	}),
);
