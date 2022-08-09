import path from 'path';
import buildIcons, { createIconDocs } from '@af/icon-build-process';
import type { IconBuildConfig } from '@af/icon-build-process';
import pkgDir from 'pkg-dir';
import fs from 'fs-extra';

const root = pkgDir.sync();

if (!root) {
  throw new Error('Root directory was not found');
}

const config: IconBuildConfig = {
  srcDir: path.resolve(root!, 'svgs_raw'),
  processedDir: path.resolve(root!, 'svgs'),
  destDir: path.resolve(root!, 'glyph'),
  maxWidth: 24,
  maxHeight: 24,
  glob: '**/*.svg',
  baseIconEntryPoint: '@atlaskit/icon/base',
  isColorsDisabled: true,
};

buildIcons(config).then((icons) => {
  const iconDocs = createIconDocs(icons, '@atlaskit/icon-priority', {}, [
    'priority',
    'icon-priority',
  ]);

  return fs.outputFile(path.resolve(root!, 'src/metadata.ts'), iconDocs);
});
