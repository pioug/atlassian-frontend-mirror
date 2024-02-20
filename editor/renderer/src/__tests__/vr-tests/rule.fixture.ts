import { ruleNodeAdf } from '../__fixtures__/full-width-adf';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const RuleRenderer = generateRendererComponent({
  document: ruleNodeAdf,
  appearance: 'full-width',
});
