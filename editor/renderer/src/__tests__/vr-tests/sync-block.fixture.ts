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
		syncBlock: getSyncedBlockNodeComponent(
			mockSyncedBlockProviderWithStaticData,
			syncBlockWithParagraphAndPanelAdf,
		),
	},
});

export const SyncBlockWithPermissionDenied = generateRendererComponent(
	{
		document: syncBlockPermissionDeniedAdf,
		appearance: 'full-width',
		nodeComponents: {
			syncBlock: getSyncedBlockNodeComponent(
				mockSyncedBlockProviderWithStaticData,
				syncBlockPermissionDeniedAdf,
			),
		},
	},
	{ mockRelayEnvironment: true },
);

export const SyncBlockNotFound = generateRendererComponent({
	document: syncBlockNotFoundAdf,
	appearance: 'full-width',
	nodeComponents: {
		syncBlock: getSyncedBlockNodeComponent(
			mockSyncedBlockProviderWithStaticData,
			syncBlockNotFoundAdf,
		),
	},
});

export const SyncBlockGenericError = generateRendererComponent({
	document: syncBlockGenericErrorAdf,
	appearance: 'full-width',
	nodeComponents: {
		syncBlock: getSyncedBlockNodeComponent(
			mockSyncedBlockProviderWithStaticData,
			syncBlockGenericErrorAdf,
		),
	},
});

export const SyncBlockLoadingState = generateRendererComponent({
	document: syncBlockLoadingStateAdf,
	appearance: 'full-width',
	nodeComponents: {
		syncBlock: getSyncedBlockNodeComponent(
			mockSyncedBlockProviderWithStaticData,
			syncBlockLoadingStateAdf,
		),
	},
});
