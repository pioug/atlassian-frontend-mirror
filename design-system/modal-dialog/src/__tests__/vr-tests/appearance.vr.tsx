import { snapshot } from '@af/visual-regression';

import ExampleAppearance from '../../../examples/10-appearance';

snapshot(ExampleAppearance, {
  drawsOutsideBounds: true,
});
