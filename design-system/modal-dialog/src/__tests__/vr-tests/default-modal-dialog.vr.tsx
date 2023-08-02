import { snapshot } from '@af/visual-regression';

import DefaultModal from '../../../examples/00-default-modal';

snapshot(DefaultModal, {
  drawsOutsideBounds: true,
});
