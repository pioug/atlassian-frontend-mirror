import * as unsupportedInlineAdf from '../__fixtures__/unsupported-inline.adf.json';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const UnsupportedInlineRenderer = generateRendererComponent({
  document: unsupportedInlineAdf,
  appearance: 'full-width',
});
