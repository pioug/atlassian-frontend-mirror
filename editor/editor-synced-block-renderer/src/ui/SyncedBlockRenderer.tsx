import React, { memo, useMemo } from 'react';

import type { DocNode } from '@atlaskit/adf-schema';
import {
	ProviderFactory,
	type SyncedBlockRendererDataProviders,
} from '@atlaskit/editor-common/provider-factory';
import {
	SyncBlockError,
	type SyncBlockInstance,
	type SyncBlockData,
} from '@atlaskit/editor-synced-block-provider';
import { ReactRenderer } from '@atlaskit/renderer';
import { RendererActionsContext } from '@atlaskit/renderer/actions';

import { SyncedBlockErrorComponent } from './SyncedBlockErrorComponent';
import { SyncedBlockLoadingState } from './SyncedBlockLoadingState';

export type SyncedBlockRendererProps = {
	syncBlockRendererDataProviders: SyncedBlockRendererDataProviders;
	useFetchSyncBlockData: () => SyncBlockInstance | null;
};

export const convertSyncBlockRendererDataProvidersToProviderFactory = (
	dataProviders: SyncedBlockRendererDataProviders,
): ProviderFactory => {
	return ProviderFactory.create({
		cardProvider: dataProviders?.cardProvider,
		emojiProvider: dataProviders?.emojiProvider,
		mediaProvider: dataProviders?.mediaProvider,
		mentionProvider: dataProviders?.mentionProvider,
		profilecardProvider: dataProviders?.profilecardProvider,
		taskDecisionProvider: dataProviders?.taskDecisionProvider,
	});
};

const SyncedBlockRendererWrapper = ({
	fetchedData,
	providerFactory,
}: {
	fetchedData: SyncBlockData;
	providerFactory: ProviderFactory;
}) => {
	const syncBlockDoc: DocNode = useMemo(() => {
		return {
			content: fetchedData.content ?? [],
			version: 1,
			type: 'doc',
		} as DocNode;
	}, [fetchedData]);

	return (
		<RendererActionsContext>
			<div data-testid="sync-block-renderer-wrapper">
				<ReactRenderer
					appearance="full-width"
					adfStage="stage0"
					document={syncBlockDoc}
					disableHeadingIDs={true}
					dataProviders={providerFactory}
				/>
			</div>
		</RendererActionsContext>
	);
};

const SyncedBlockRendererComponent = ({
	useFetchSyncBlockData,
	syncBlockRendererDataProviders,
}: SyncedBlockRendererProps) => {
	const fetchResult = useFetchSyncBlockData();

	const providerFactory = useMemo(() => {
		return convertSyncBlockRendererDataProvidersToProviderFactory(syncBlockRendererDataProviders);
	}, [syncBlockRendererDataProviders]);

	if (!fetchResult) {
		return <SyncedBlockLoadingState />;
	}

	if (fetchResult.error || !fetchResult.data) {
		return (
			<SyncedBlockErrorComponent
				error={fetchResult.error ?? SyncBlockError.Errored}
				resourceId={fetchResult.resourceId}
			/>
		);
	}

	return (
		<SyncedBlockRendererWrapper fetchedData={fetchResult.data} providerFactory={providerFactory} />
	);
};

export const SyncedBlockRenderer = memo(SyncedBlockRendererComponent);
