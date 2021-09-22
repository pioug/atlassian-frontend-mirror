import path from 'path';
import { build, createIconDocs, tidy } from '@af/icon-build-process';
import type { IconBuildConfig } from '@af/icon-build-process';
import pkgDir from 'pkg-dir';
import fs from 'fs-extra';

const root = pkgDir.sync();

const config16: IconBuildConfig = {
  srcDir: path.resolve(root!, 'svgs_raw'),
  processedDir: path.resolve(root!, 'svgs'),
  destDir: path.resolve(root!, 'glyph'),
  maxWidth: 16,
  maxHeight: 16,
  glob: '**/16.svg',
  size: 'small',
  baseIconEntryPoint: '@atlaskit/icon/base',
  isColorsDisabled: true,
};

const config24: IconBuildConfig = {
  srcDir: path.resolve(root!, 'svgs_raw'),
  processedDir: path.resolve(root!, 'svgs'),
  destDir: path.resolve(root!, 'glyph'),
  maxWidth: 24,
  maxHeight: 24,
  glob: '**/24.svg',
  size: 'medium',
  baseIconEntryPoint: '@atlaskit/icon/base',
  isColorsDisabled: true,
};

tidy(config16)
  .then(() => Promise.all([build(config16), build(config24)]))
  .then(([sixteen, twentyfour]) => {
    const allIcons = [...sixteen, ...twentyfour];
    const iconDocs = createIconDocs(allIcons, '@atlaskit/icon-object', {}, [
      'object',
      'icon-object',
    ]);

    console.log('@atlaskit-icon-object built');

    return fs.outputFile(path.resolve(root!, 'src/metadata.ts'), iconDocs);
  });
