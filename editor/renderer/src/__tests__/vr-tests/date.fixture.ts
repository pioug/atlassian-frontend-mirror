import * as adfWithDate from '../__fixtures__/date.adf.json';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const DateRenderer = generateRendererComponent({
  document: adfWithDate,
  appearance: 'full-width',
});
