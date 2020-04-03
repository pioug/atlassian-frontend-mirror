const path = require('path');
const iconBuild = require('@atlaskit/icon-build-process');
const pkgDir = require('pkg-dir');
const fs = require('fs-extra');

const root = pkgDir.sync();

const { tidy, build, createIconDocs } = iconBuild;

const config16 = {
  srcDir: path.resolve(root, 'svgs_raw'),
  processedDir: path.resolve(root, 'svgs'),
  destDir: path.resolve(root, 'glyph'),
  maxWidth: 16,
  maxHeight: 16,
  glob: '**/16.svg',
  size: 'small',
};
const config24 = {
  srcDir: path.resolve(root, 'svgs_raw'),
  processedDir: path.resolve(root, 'svgs'),
  destDir: path.resolve(root, 'glyph'),
  maxWidth: 24,
  maxHeight: 24,
  glob: '**/24.svg',
  size: 'medium',
};
const config48 = {
  srcDir: path.resolve(root, 'svgs_raw'),
  processedDir: path.resolve(root, 'svgs'),
  destDir: path.resolve(root, 'glyph'),
  maxWidth: 48,
  maxHeight: 64,
  glob: '**/48.svg',
  size: 'xlarge',
};

tidy(config16)
  .then(() => Promise.all([build(config16), build(config24), build(config48)]))
  .then(([sixteen, twentyfour, fourtyeight]: any[]) => {
    let allIcons = [...sixteen, ...twentyfour, ...fourtyeight];
    const iconDocs = createIconDocs(allIcons, '@atlaskit/icon-file-type', {}, [
      'file-type',
      'icon-file-type',
    ]);
    console.log('@atlaskit/icon-file-type built');
    return fs.outputFile(path.resolve(root, 'src/metadata.ts'), iconDocs);
  });
