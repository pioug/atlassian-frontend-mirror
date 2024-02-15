import type { API, FileInfo } from 'jscodeshift';

import splitImportsTransformer from './codemods/next-split-imports';
import migrateToNewButtonVariantsTransformer from './codemods/next-migrate-to-new-button-variants';

export default async function transformer(
  file: FileInfo,
  api: API,
): Promise<string> {
  const transformers = [
    splitImportsTransformer,
    migrateToNewButtonVariantsTransformer,
  ];
  let src = file.source;
  transformers.forEach((transformer) => {
    if (typeof src === 'undefined') {
      return;
    }
    const nextSrc = transformer({ ...file, source: src }, api);

    if (nextSrc) {
      src = nextSrc;
    }
  });

  return src;
}
