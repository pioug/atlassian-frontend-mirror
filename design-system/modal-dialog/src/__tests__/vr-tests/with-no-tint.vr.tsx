import { snapshot } from '@af/visual-regression';

import WithHiddenBlanket from '../../../examples/92-with-hidden-blanket';

snapshot(WithHiddenBlanket, {
  drawsOutsideBounds: true,
});
