import path from 'path';
import buildIcons, { createIconDocs } from '@af/icon-build-process';
import type { IconBuildConfig } from '@af/icon-build-process';
import pkgDir from 'pkg-dir';
import fs from 'fs-extra';
import synonyms from '../utils/synonyms';
import coreIconMetadata from '../icons_raw/metadata-core';
import utilityIconMetadata from '../icons_raw/metadata-utility';

const root = pkgDir.sync();

if (!root) {
  throw new Error('Root directory was not found');
}

/**
 * The legacy icon build process. A past SVGO update disabled this process and slightly changed the SVG output.
 * Re-running this step re-generates all icons and triggers a large number of platform/product snapshot tests.
 *
 * To avoid unnecessary churn, this step is switched off, and any updates to the old icon set can be done piecemeal.
 */

// const config: IconBuildConfig = {
//   srcDir: path.resolve(root, 'svgs_raw'),
//   processedDir: path.resolve(root, 'svgs'),
//   destDir: path.resolve(root, 'glyph'),
//   maxWidth: 24,
//   maxHeight: 24,
//   glob: '**/*.svg',
//   baseIconEntryPoint: '@atlaskit/icon/base',
// };
// buildIcons(config).then((icons) => {
//   const iconDocs = createIconDocs(icons, '@atlaskit/icon', synonyms, [
//     'icon',
//     'core',
//   ]);
//   return fs.outputFile(path.resolve(root, 'src/metadata.tsx'), iconDocs);
// });

/**
 * The updated icon build process for the new icons under `@atlaskit/icon/core/*`
 */
const configCore: IconBuildConfig = {
  srcDir: path.resolve(root, 'icons_raw/core'),
  processedDir: path.resolve(root, 'icons_optimised/core'),
  destDir: path.resolve(root, 'core'),
  maxWidth: 24,
  maxHeight: 24,
  glob: '**/*.svg',
  baseIconEntryPoint: '@atlaskit/icon/UNSAFE_base-new',
  isUpdatedIconBuildEnabled: true,
  iconType: 'core',
  metadata: coreIconMetadata,
};

buildIcons(configCore).then((icons) => {
  const iconDocs = createIconDocs(
    icons,
    '@atlaskit/icon/core',
    synonyms,
    ['icon', 'core'],
    true,
    coreIconMetadata,
  );

  return fs.outputFile(path.resolve(root, 'src/metadata-core.tsx'), iconDocs);
});

/**
 * The updated icon build process for the new icons under `@atlaskit/icon/utility/*`
 */
const configUtility: IconBuildConfig = {
  srcDir: path.resolve(root, 'icons_raw/utility'),
  processedDir: path.resolve(root, 'icons_optimised/utility'),
  destDir: path.resolve(root, 'utility'),
  maxWidth: 12,
  maxHeight: 12,
  glob: '**/*.svg',
  baseIconEntryPoint: '@atlaskit/icon/UNSAFE_base-new',
  isUpdatedIconBuildEnabled: true,
  iconType: 'utility',
  metadata: utilityIconMetadata,
};

buildIcons(configUtility).then((icons) => {
  const iconDocs = createIconDocs(
    icons,
    '@atlaskit/icon/utility',
    synonyms,
    ['icon', 'utility'],
    true,
    utilityIconMetadata,
  );

  return fs.outputFile(
    path.resolve(root, 'src/metadata-utility.tsx'),
    iconDocs,
  );
});
