import { snapshot } from '@af/visual-regression';

import EmptyStateCompact from '../../examples/vr/empty-state-compact';
import EmptyState from '../../examples/vr/empty-state-vr';

snapshot(EmptyState, {
	description: 'Modals empty state',
	drawsOutsideBounds: true,
	featureFlags: {
		'bandicoots-compiled-migration-link-datasource': [true, false],
	},
});

snapshot(EmptyStateCompact, {
	description: 'Modals empty state compact',
	drawsOutsideBounds: true,
	featureFlags: {
		'bandicoots-compiled-migration-link-datasource': [true, false],
	},
});
