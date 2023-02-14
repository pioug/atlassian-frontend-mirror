/* eslint-disable no-console */
import { writeFile } from 'fs/promises';
import { join } from 'path';

import { createPartialSignedArtifact, createSignedArtifact } from '@af/codegen';

import { createColorStylesFromTemplate } from './color-codegen-template';
import { createColorMapTemplate } from './color-map-template';
import { createDimensionStylesFromTemplate } from './dimension-codegen-template';
import { createStylesFromTemplate } from './misc-codegen-template';
import { createSpacingStylesFromTemplate } from './spacing-codegen-template';

const colorMapOutputFolder = join(__dirname, '../', 'src', 'internal');
const colorTokensDependencyPath = require.resolve(
  '../../tokens/src/artifacts/tokens-raw/atlassian-light',
);
const spacingTokensDependencyPath = require.resolve(
  '../../tokens/src/artifacts/tokens-raw/atlassian-spacing',
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

// generate colors
Promise.all(
  [{ target: 'box.partial.tsx' }].map(({ target }) => {
    const targetPath = join(
      __dirname,
      '../',
      'src',
      'components',
      'internal',
      target,
    );

    const source = createPartialSignedArtifact(
      options => options.map(createColorStylesFromTemplate).join('\n'),
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
    // generate spacing values
    return Promise.all(
      [
        { path: ['internal', 'box.partial.tsx'] },
        { path: ['inline.partial.tsx'] },
        { path: ['stack.partial.tsx'] },
      ].map(({ path }) => {
        const targetPath = join(__dirname, '../', 'src', 'components', ...path);

        const source = createPartialSignedArtifact(
          options => options.map(createSpacingStylesFromTemplate).join('\n'),
          'yarn codegen-styles',
          {
            id: 'spacing',
            absoluteFilePath: targetPath,
            dependencies: [spacingTokensDependencyPath],
          },
        );

        return writeFile(targetPath, source).then(() =>
          console.log(`${targetPath} written!`),
        );
      }),
    );
  })
  .then(() => {
    // generate other values
    return Promise.all(
      [{ path: ['internal', 'box.partial.tsx'] }].map(({ path }) => {
        const targetPath = join(__dirname, '../', 'src', 'components', ...path);

        const source = createPartialSignedArtifact(
          options => options.map(createStylesFromTemplate).join('\n'),
          'yarn codegen-styles',
          { id: 'misc', absoluteFilePath: targetPath },
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
      'internal',
      'box.partial.tsx',
    );

    const source = createPartialSignedArtifact(
      options => options.map(createDimensionStylesFromTemplate).join('\n'),
      'yarn codegen-styles',
      {
        id: 'dimensions',
        absoluteFilePath: targetPath,
      },
    );

    return writeFile(targetPath, source).then(() =>
      console.log(`${targetPath} written!`),
    );
  });
