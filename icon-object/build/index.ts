import path from 'path';
import iconBuild from '@atlaskit/icon-build-process';
import pkgDir from 'pkg-dir';
import fs from 'fs-extra';

const root = pkgDir.sync();

const { tidy, build, createIconDocs } = iconBuild;

const config16 = {
  srcDir: path.resolve(root!, 'svgs_raw'),
  processedDir: path.resolve(root!, 'svgs'),
  destDir: path.resolve(root!, 'glyph'),
  maxWidth: 16,
  maxHeight: 16,
  glob: '**/16.svg',
  size: 'small',
};
const config24 = {
  srcDir: path.resolve(root!, 'svgs_raw'),
  processedDir: path.resolve(root!, 'svgs'),
  destDir: path.resolve(root!, 'glyph'),
  maxWidth: 24,
  maxHeight: 24,
  glob: '**/24.svg',
  size: 'medium',
};

tidy(config16)
  .then(() => Promise.all([build(config16), build(config24)]))
  .then(([sixteen, twentyfour]: any[]) => {
    let allIcons = [...sixteen, ...twentyfour];
    const iconDocs = createIconDocs(allIcons, '@atlaskit/icon-object', {}, [
      'object',
      'icon-object',
    ]);
    console.log('@atlaskit-icon-object built');
    return fs.outputFile(path.resolve(root!, 'src/metadata.ts'), iconDocs);
  });
