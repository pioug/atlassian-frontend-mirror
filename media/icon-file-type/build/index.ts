import path from 'path';
import { build, createIconDocs, tidy } from '@af/icon-build-process';
import type { IconBuildConfig } from '@af/icon-build-process';
import pkgDir from 'pkg-dir';
import fs from 'fs-extra';

const root = pkgDir.sync();

if (!root) {
  throw new Error('Root directory was not found');
}

const config16: IconBuildConfig = {
  srcDir: path.resolve(root, 'svgs_raw'),
  processedDir: path.resolve(root, 'svgs'),
  destDir: path.resolve(root, 'glyph'),
  maxWidth: 16,
  maxHeight: 16,
  size: 'small',
  glob: '**/16.svg',
  baseIconEntryPoint: '@atlaskit/icon/base',
  isColorsDisabled: true,
};

const config24: IconBuildConfig = {
  srcDir: path.resolve(root, 'svgs_raw'),
  processedDir: path.resolve(root, 'svgs'),
  destDir: path.resolve(root, 'glyph'),
  maxWidth: 24,
  maxHeight: 24,
  size: 'medium',
  glob: '**/24.svg',
  baseIconEntryPoint: '@atlaskit/icon/base',
  isColorsDisabled: true,
};

const config48: IconBuildConfig = {
  srcDir: path.resolve(root, 'svgs_raw'),
  processedDir: path.resolve(root, 'svgs'),
  destDir: path.resolve(root, 'glyph'),
  // THIS SIZE IS A SNOW FLAKE IN THE ATLASSIAN DESIGN SYSTEM
  maxWidth: 48,
  maxHeight: 64,
  width: 48,
  height: 64,
  // END THESE SIZES ARE A SNOW FLAKE
  glob: '**/48.svg',
  baseIconEntryPoint: '@atlaskit/icon/base',
  isColorsDisabled: true,
};

tidy(config16)
  .then(() => Promise.all([build(config16), build(config24), build(config48)]))
  .then(([sixteen, twentyfour, fourtyeight]) => {
    const allIcons = [...sixteen, ...twentyfour, ...fourtyeight];

    const iconDocs = createIconDocs(allIcons, '@atlaskit/icon-file-type', {}, [
      'file-type',
      'icon-file-type',
    ]);

    console.log('@atlaskit/icon-file-type built');

    return fs.outputFile(path.resolve(root, 'src/metadata.ts'), iconDocs);
  });
