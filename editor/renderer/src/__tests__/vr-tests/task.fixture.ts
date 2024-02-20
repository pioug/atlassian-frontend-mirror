import { taskNodeAdf } from '../__fixtures__/full-width-adf';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const TaskRenderer = generateRendererComponent({
  document: taskNodeAdf,
  appearance: 'full-width',
});
