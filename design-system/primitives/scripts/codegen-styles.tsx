/* eslint-disable no-console */
import { readdirSync, writeFileSync } from 'fs';
import { join } from 'path';

import { createPartialSignedArtifact } from '@atlassian/codegen';

import { createBorderStylesFromTemplate } from './border-codegen-template';
import { createColorStylesFromTemplate } from './color-codegen-template';
import { createElevationStylesFromTemplate } from './elevation-codegen-template';
import { createInverseColorMapTemplate } from './inverse-color-map-template';
import { createStylesFromFileTemplate } from './misc-codegen-template';
import { createSpacingStylesFromTemplate } from './spacing-codegen-template';
import { createTypographyStylesFromTemplate } from './typography-codegen-template';

const colorTokensDependencyPath = require.resolve(
  '../../tokens/src/artifacts/tokens-raw/atlassian-light',
);
const spacingTokensDependencyPath = require.resolve(
  '../../tokens/src/artifacts/tokens-raw/atlassian-spacing',
);
const shapeTokensDependencyPath = require.resolve(
  '../../tokens/src/artifacts/tokens-raw/atlassian-shape',
);

const templateFiles = readdirSync(join(__dirname, 'codegen-file-templates'), {
  withFileTypes: true,
})
  .filter(item => !item.isDirectory())
  .map(item => join(__dirname, 'codegen-file-templates', item.name));

const targetPath = join(
  __dirname,
  '../',
  'src',
  'xcss',
  'style-maps.partial.tsx',
);

const sourceFns = [
  // width, height, minWidth, maxWidth, minHeight, maxHeight
  () =>
    createPartialSignedArtifact(
      options => options.map(createStylesFromFileTemplate).join('\n'),
      'yarn workspace @atlaskit/primitives codegen-styles',
      {
        id: 'dimensions',
        absoluteFilePath: targetPath,
        dependencies: templateFiles.filter(v => v.includes('dimensions')),
      },
    ),
  // padding*, gap*, inset*
  () =>
    createPartialSignedArtifact(
      createSpacingStylesFromTemplate,
      'yarn workspace @atlaskit/primitives codegen-styles',
      {
        id: 'spacing',
        absoluteFilePath: targetPath,
        dependencies: [spacingTokensDependencyPath],
      },
    ),
  // text color, background-color, border-color
  () =>
    createPartialSignedArtifact(
      options => options.map(createColorStylesFromTemplate).join('\n'),
      'yarn workspace @atlaskit/primitives codegen-styles',
      {
        id: 'colors',
        absoluteFilePath: targetPath,
        dependencies: [colorTokensDependencyPath],
      },
    ),
  // inverse color map
  () =>
    createPartialSignedArtifact(
      createInverseColorMapTemplate,
      'yarn workspace @atlaskit/primitives codegen-styles',
      {
        id: 'inverse-colors',
        absoluteFilePath: targetPath,
        dependencies: [colorTokensDependencyPath],
      },
    ),
  // elevation (opacity, shadow, surface)
  () =>
    createPartialSignedArtifact(
      options => options.map(createElevationStylesFromTemplate).join('\n'),
      'yarn workspace @atlaskit/primitives codegen-styles',
      {
        id: 'elevation',
        absoluteFilePath: targetPath,
        dependencies: [colorTokensDependencyPath],
      },
    ),
  // border-width, border-radius
  () =>
    createPartialSignedArtifact(
      options => options.map(createBorderStylesFromTemplate).join('\n'),
      'yarn workspace @atlaskit/primitives codegen-styles',
      {
        id: 'border',
        absoluteFilePath: targetPath,
        dependencies: [shapeTokensDependencyPath],
      },
    ),
  // border-color, border-radius, border-width, layer',
  () =>
    createPartialSignedArtifact(
      options => options.map(createStylesFromFileTemplate).join('\n'),
      'yarn workspace @atlaskit/primitives codegen-styles',
      {
        id: 'misc',
        absoluteFilePath: targetPath,
        dependencies: templateFiles,
      },
    ),
  // font*, lineheight
  () =>
    createPartialSignedArtifact(
      createTypographyStylesFromTemplate,
      'yarn workspace @atlaskit/primitives codegen-styles',
      {
        id: 'typography',
        absoluteFilePath: targetPath,
        dependencies: templateFiles,
      },
    ),
];

sourceFns.forEach(sourceFn => {
  writeFileSync(targetPath, sourceFn());
});

console.log(`${targetPath} written!`);
