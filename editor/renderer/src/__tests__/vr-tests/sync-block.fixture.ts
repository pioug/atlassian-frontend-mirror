import {
	syncBlockWithParagraphAndPanelAdf,
	syncBlockNotFoundAdf,
	syncBlockPermissionDeniedAdf,
	syncBlockGenericErrorAdf,
	syncBlockLoadingStateAdf,
} from './__fixtures__/sync-block.adf';

import { generateRendererComponent } from '../__helpers/rendererComponents';
import { getSyncedBlockNodeComponent } from '@atlaskit/editor-synced-block-renderer';
import { mockSyncedBlockProviderWithStaticData } from '@atlaskit/editor-test-helpers/sync-block-mock-providers';

export const SyncBlockWithParagraphAndPanelRenderer = generateRendererComponent({
	document: syncBlockWithParagraphAndPanelAdf,
	appearance: 'full-width',
	nodeComponents: {
		syncBlock: getSyncedBlockNodeComponent({
			doc: syncBlockWithParagraphAndPanelAdf,
			syncBlockProvider: mockSyncedBlockProviderWithStaticData,
			syncBlockRendererOptions: undefined,
		}),
	},
});

export const SyncBlockWithPermissionDenied = generateRendererComponent(
	{
		document: syncBlockPermissionDeniedAdf,
		appearance: 'full-width',
		nodeComponents: {
			syncBlock: getSyncedBlockNodeComponent({
				doc: syncBlockPermissionDeniedAdf,
				syncBlockProvider: mockSyncedBlockProviderWithStaticData,
				syncBlockRendererOptions: undefined,
			}),
		},
	},
	{ mockRelayEnvironment: true },
);

export const SyncBlockNotFound = generateRendererComponent({
	document: syncBlockNotFoundAdf,
	appearance: 'full-width',
	nodeComponents: {
		syncBlock: getSyncedBlockNodeComponent({
			doc: syncBlockNotFoundAdf,
			syncBlockProvider: mockSyncedBlockProviderWithStaticData,
			syncBlockRendererOptions: undefined,
		}),
	},
});

export const SyncBlockGenericError = generateRendererComponent({
	document: syncBlockGenericErrorAdf,
	appearance: 'full-width',
	nodeComponents: {
		syncBlock: getSyncedBlockNodeComponent({
			doc: syncBlockGenericErrorAdf,
			syncBlockProvider: mockSyncedBlockProviderWithStaticData,
			syncBlockRendererOptions: undefined,
		}),
	},
});

export const SyncBlockLoadingState = generateRendererComponent({
	document: syncBlockLoadingStateAdf,
	appearance: 'full-width',
	nodeComponents: {
		syncBlock: getSyncedBlockNodeComponent({
			doc: syncBlockLoadingStateAdf,
			syncBlockProvider: mockSyncedBlockProviderWithStaticData,
			syncBlockRendererOptions: undefined,
		}),
	},
});
