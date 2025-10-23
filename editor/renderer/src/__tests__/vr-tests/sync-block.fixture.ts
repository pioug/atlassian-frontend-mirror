import { syncBlockWithParagraphAndPanelAdf } from './__fixtures__/sync-block.adf';

import { generateRendererComponent } from '../__helpers/rendererComponents';
import { getSyncBlockNodeComponent } from '@atlaskit/editor-synced-block-renderer';
import { mockSyncedBlockProviderWithStaticData } from '@atlaskit/editor-test-helpers/sync-block-mock-providers';

export const SyncBlockWithParagraphAndPanelRenderer = generateRendererComponent({
	document: syncBlockWithParagraphAndPanelAdf,
	appearance: 'full-width',
	nodeComponents: {
		syncBlock: getSyncBlockNodeComponent(
			mockSyncedBlockProviderWithStaticData,
			syncBlockWithParagraphAndPanelAdf,
		),
	},
});
