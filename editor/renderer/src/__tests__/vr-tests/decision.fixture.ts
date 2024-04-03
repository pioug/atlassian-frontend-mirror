import { decisionNodeAdf } from '../__fixtures__/full-width-adf';
import * as decisionAdf from '../__fixtures__/decision-adf.json';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const DecisionRenderer = generateRendererComponent({
  document: decisionNodeAdf,
  appearance: 'full-width',
});

export const DecisionHoverRenderer = generateRendererComponent({
  document: decisionAdf,
  appearance: 'full-width',
});
