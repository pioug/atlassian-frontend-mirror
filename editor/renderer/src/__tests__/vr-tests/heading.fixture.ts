import { headingNodeAdf } from '../__fixtures__/full-width-adf';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const HeadingRenderer = generateRendererComponent({
  document: headingNodeAdf,
  appearance: 'full-width',
});
