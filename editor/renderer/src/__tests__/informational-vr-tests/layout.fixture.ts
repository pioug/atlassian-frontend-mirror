import { overflowLayout } from '../__fixtures__/overflow.adf';

import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const OverflowLayoutRenderer = generateRendererComponent({
  document: overflowLayout,
  appearance: 'full-page',
  extensionHandlers,
});
