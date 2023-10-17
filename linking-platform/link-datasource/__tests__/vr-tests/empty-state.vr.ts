import { snapshot } from '@af/visual-regression';

import EmptyState from '../../examples/empty-state';
import EmptyStateCompact from '../../examples/empty-state-compact';

snapshot(EmptyState, {
  description: 'Modals empty state',
  drawsOutsideBounds: true,
});

snapshot(EmptyStateCompact, {
  description: 'Modals empty state compact',
  drawsOutsideBounds: true,
});
