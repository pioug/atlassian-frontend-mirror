import { tableAdf } from '../__fixtures__/full-width-adf';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const TableRenderer = generateRendererComponent({
  document: tableAdf,
  appearance: 'full-width',
});
