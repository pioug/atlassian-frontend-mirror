import { snapshot } from '@af/visual-regression';

import { BodiedSyncBlockWithLayoutAndMediaRenderer } from './bodied-sync-block.fixture.vr.ap';

snapshot(BodiedSyncBlockWithLayoutAndMediaRenderer, {
	featureFlags: {
		advanced_layouts: true,
	},
	description: 'Bodied sync block should render layout and annotation',
});
