import { unsupportedBlockAdf } from '../__fixtures__/unsupported-block';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const UnsupportedBlockRenderer = generateRendererComponent({
  document: unsupportedBlockAdf,
  appearance: 'full-width',
});
