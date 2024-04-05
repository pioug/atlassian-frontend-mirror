import { tableAdf } from '../__fixtures__/full-width-adf';
import {
  overflowTable,
  overflowTableFullWidth,
  overflowTableWide,
} from '../__fixtures__/overflow.adf';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const TableRenderer = generateRendererComponent({
  document: tableAdf,
  appearance: 'full-width',
});

export const TableRendererOverflow = generateRendererComponent({
  document: overflowTable,
  appearance: 'full-page',
});

export const TableRendererWideOverflow = generateRendererComponent({
  document: overflowTableWide,
  appearance: 'full-page',
});

export const TableRendererFullWidthOverflow = generateRendererComponent({
  document: overflowTableFullWidth,
  appearance: 'full-page',
});
