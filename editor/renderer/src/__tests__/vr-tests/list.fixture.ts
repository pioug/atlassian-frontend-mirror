import { listNodeAdf } from '../__fixtures__/full-width-adf';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const ListRenderer = generateRendererComponent({
  document: listNodeAdf,
  appearance: 'full-width',
});
