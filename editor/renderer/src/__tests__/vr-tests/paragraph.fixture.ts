import { paragraphNodeAdf } from '../__fixtures__/full-width-adf';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const ParagraphRenderer = generateRendererComponent({
  document: paragraphNodeAdf,
  appearance: 'full-width',
});
