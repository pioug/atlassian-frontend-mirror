/* eslint-disable no-console */
import { join } from 'path';

import { writeFile } from 'fs-extra';

import { createPartialSignedArtifact } from '@af/codegen';

import { createColorStylesFromTemplate } from './color-codegen-template';
import { createSpacingStylesFromTemplate } from './spacing-codegen-template';

// generate colors
Promise.all(
  [{ target: 'text.partial.tsx' }, { target: 'box.partial.tsx' }].map(
    ({ target }) => {
      const targetPath = join(__dirname, '../', 'src', 'components', target);

      const source = createPartialSignedArtifact(
        (options) => options.map(createColorStylesFromTemplate).join('\n'),
        'yarn codegen-styles',
        { id: 'colors', absoluteFilePath: targetPath },
      );

      return writeFile(targetPath, source).then(() =>
        console.log(`${targetPath} written!`),
      );
    },
  ),
).then(() => {
  // generate spacing values
  [{ target: 'box.partial.tsx' }].forEach(({ target }) => {
    const targetPath = join(__dirname, '../', 'src', 'components', target);

    const source = createPartialSignedArtifact(
      (options) => options.map(createSpacingStylesFromTemplate).join('\n'),
      'yarn codegen-styles',
      { id: 'spacing', absoluteFilePath: targetPath },
    );

    return writeFile(targetPath, source).then(() =>
      console.log(`${targetPath} written!`),
    );
  });
});
