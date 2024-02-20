import { decisionNodeAdf } from '../__fixtures__/full-width-adf';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const DecisionRenderer = generateRendererComponent({
  document: decisionNodeAdf,
  appearance: 'full-width',
});
