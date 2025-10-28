import React from 'react';

import type { DocNode } from '@atlaskit/adf-schema';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { type FetchSyncBlockDataResult } from '@atlaskit/editor-synced-block-provider';
import { ReactRenderer } from '@atlaskit/renderer';
import { RendererActionsContext } from '@atlaskit/renderer/actions';

import { SyncedBlockErrorComponent } from './SyncedBlockErrorComponent';
import { SyncedBlockLoadingState } from './SyncedBlockLoadingState';

export type SyncedBlockRendererProps = {
	dataProviders?: ProviderFactory;
	useFetchSyncBlockData: () => FetchSyncBlockDataResult | null;
};

export const SyncedBlockRenderer = ({
	useFetchSyncBlockData,
	dataProviders,
}: SyncedBlockRendererProps) => {
	const fetchResult = useFetchSyncBlockData();

	if (!fetchResult) {
		return <SyncedBlockLoadingState />;
	}

	if ('status' in fetchResult) {
		return <SyncedBlockErrorComponent status={fetchResult.status} />;
	}

	const syncBlockData = fetchResult;
	const syncBlockDoc = {
		content: syncBlockData.content,
		version: 1,
		type: 'doc',
	} as DocNode;

	return (
		<RendererActionsContext>
			<div data-testid="sync-block-renderer-wrapper">
				<ReactRenderer
					appearance="full-width"
					adfStage="stage0"
					document={syncBlockDoc}
					disableHeadingIDs={true}
					dataProviders={dataProviders}
				/>
			</div>
		</RendererActionsContext>
	);
};
