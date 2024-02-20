import { bodiedExtensionNodeAdf } from '../__fixtures__/full-width-adf';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const BodiedExtensionRenderer = generateRendererComponent({
  document: bodiedExtensionNodeAdf,
  appearance: 'full-width',
});
