import { snapshot } from '@af/visual-regression';

import ConfluenceSearchConfigModalInitialState from '../../examples/vr/confluence-search-config-modal-initial-state-vr';
import ConfluenceSearchConfigModalNoInstances from '../../examples/vr/confluence-search-config-modal-no-instances-vr';

snapshot(ConfluenceSearchConfigModalInitialState, {
  description: 'Confluence search config modal initial state view',
  drawsOutsideBounds: true,
});

snapshot(ConfluenceSearchConfigModalNoInstances, {
  description: 'Confluence search config modal no instances view',
  drawsOutsideBounds: true,
});
