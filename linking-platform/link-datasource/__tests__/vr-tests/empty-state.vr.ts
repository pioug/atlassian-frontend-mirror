import { snapshot } from '@af/visual-regression';

import EmptyStateCompact from '../../examples/vr/empty-state-compact';
import EmptyState from '../../examples/vr/empty-state-vr';

snapshot(EmptyState, {
	description: 'Modals empty state',
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-linking-visual-refresh-sllv': [true, false],
	},
});

snapshot(EmptyStateCompact, {
	description: 'Modals empty state compact',
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-linking-visual-refresh-sllv': [true, false],
	},
});
