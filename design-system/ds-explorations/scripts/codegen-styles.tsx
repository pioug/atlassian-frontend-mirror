/* eslint-disable no-console */
import { writeFile } from 'fs/promises';
import { join } from 'path';

import {
  createPartialSignedArtifact,
  createSignedArtifact,
} from '@atlassian/codegen';

import { createColorStylesFromTemplate } from './color-codegen-template';
import { createColorMapTemplate } from './color-map-template';
import { createInteractionStylesFromTemplate } from './interaction-codegen';
import { createSpacingScaleTemplate } from './spacing-scale-template';
import { createTypographyStylesFromTemplate } from './typography-codegen-template';

const colorMapOutputFolder = join(__dirname, '../', 'src', 'internal');
const colorTokensDependencyPath = require.resolve(
  '../../tokens/src/artifacts/tokens-raw/atlassian-light',
);

const typographyTokensDependencyPath = require.resolve(
  '../../tokens/src/artifacts/tokens-raw/atlassian-typography-adg3',
);

writeFile(
  join(colorMapOutputFolder, 'color-map.tsx'),
  createSignedArtifact(createColorMapTemplate(), 'yarn codegen-styles', {
    description:
      'The color map is used to map a background color token to a matching text color that will meet contrast.',
    dependencies: [colorTokensDependencyPath],
    outputFolder: colorMapOutputFolder,
  }),
).then(() => console.log(join(colorMapOutputFolder, 'color-map.tsx')));

writeFile(
  join(__dirname, '../', 'src', 'internal', 'spacing-scale.tsx'),
  createSignedArtifact(
    createSpacingScaleTemplate(),
    'yarn codegen-styles',
    'Internal codegen of the spacing scale values. Only used for internal examples.',
  ),
).then(() => console.log('spacing-scale.tsx written!'));

// generate colors
Promise.all(
  [{ target: 'text.partial.tsx' }].map(({ target }) => {
    const targetPath = join(__dirname, '../', 'src', 'components', target);

    const source = createPartialSignedArtifact(
      (options) => options.map(createColorStylesFromTemplate).join('\n'),
      'yarn codegen-styles',
      {
        id: 'colors',
        absoluteFilePath: targetPath,
        dependencies: [colorTokensDependencyPath],
      },
    );

    return writeFile(targetPath, source).then(() =>
      console.log(`${targetPath} written!`),
    );
  }),
)
  .then(() => {
    // generate typography values
    return Promise.all(
      [{ target: 'text.partial.tsx' }].map(({ target }) => {
        const targetPath = join(__dirname, '../', 'src', 'components', target);

        const source = createPartialSignedArtifact(
          (options) =>
            options.map(createTypographyStylesFromTemplate).join('\n'),
          'yarn codegen-styles',
          {
            id: 'typography',
            absoluteFilePath: targetPath,
            dependencies: [typographyTokensDependencyPath],
          },
        );

        return writeFile(targetPath, source).then(() =>
          console.log(`${targetPath} written!`),
        );
      }),
    );
  })
  .then(() => {
    const targetPath = join(
      __dirname,
      '../',
      'src',
      'components',
      'interaction-surface.partial.tsx',
    );

    const source = createPartialSignedArtifact(
      (options) => options.map(createInteractionStylesFromTemplate).join('\n'),
      'yarn codegen-styles',
      {
        id: 'interactions',
        absoluteFilePath: targetPath,
        dependencies: [colorTokensDependencyPath],
      },
    );

    return writeFile(targetPath, source).then(() =>
      console.log(`${targetPath} written!`),
    );
  });
