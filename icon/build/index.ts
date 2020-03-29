import path from 'path';
import buildIcons from '@atlaskit/icon-build-process';
import pkgDir from 'pkg-dir';
import fs from 'fs-extra';
import synonyms from '../utils/synonyms';

const root = pkgDir.sync();

if (!root) {
  throw new Error('Root directory was not found');
}

const config = {
  srcDir: path.resolve(root, 'svgs_raw'),
  processedDir: path.resolve(root, 'svgs'),
  destDir: path.resolve(root, 'glyph'),
  maxWidth: 24,
  maxHeight: 24,
  glob: '**/*.svg',
};

buildIcons(config).then((icons: any) => {
  const iconDocs = buildIcons.createIconDocs(
    icons,
    '@atlaskit/icon',
    synonyms,
    ['icon', 'core'],
  );

  return fs.outputFile(path.resolve(root, 'src/metadata.ts'), iconDocs);
});
