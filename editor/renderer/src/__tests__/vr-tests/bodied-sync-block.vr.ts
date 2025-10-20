import { snapshot } from '@af/visual-regression';
import { BodiedSyncBlockWithLayoutAndMediaRenderer } from './bodied-sync-block.fixture';

snapshot(BodiedSyncBlockWithLayoutAndMediaRenderer, {
	featureFlags: {
		platform_synced_block: true,
		advanced_layouts: true,
	},
	description: 'Bodied sync block should render layout and annotation',
});
