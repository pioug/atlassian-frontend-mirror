import { snapshot } from '@af/visual-regression';

import WithCurrentSurface from '../../../examples/96-with-current-surface';

snapshot(WithCurrentSurface, {
  drawsOutsideBounds: true,
});
