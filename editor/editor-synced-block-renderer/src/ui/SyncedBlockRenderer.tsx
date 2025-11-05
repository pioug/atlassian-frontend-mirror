import React, { memo, useMemo } from 'react';

import type { DocNode } from '@atlaskit/adf-schema';
import {
	ProviderFactory,
	type SyncedBlockRendererDataProviders,
} from '@atlaskit/editor-common/provider-factory';
import {
	SyncBlockError,
	type UseFetchSyncBlockDataResult,
} from '@atlaskit/editor-synced-block-provider';

import type { SyncedBlockRendererOptions } from '../types';

import { AKRendererWrapper } from './AKRendererWrapper';
import { SyncedBlockErrorComponent } from './SyncedBlockErrorComponent';
import { SyncedBlockLoadingState } from './SyncedBlockLoadingState';

export type SyncedBlockRendererProps = {
	syncBlockRendererDataProviders: SyncedBlockRendererDataProviders;
	syncBlockRendererOptions: SyncedBlockRendererOptions | undefined;
	useFetchSyncBlockData: () => UseFetchSyncBlockDataResult;
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

const SyncedBlockRendererComponent = ({
	useFetchSyncBlockData,
	syncBlockRendererDataProviders,
	syncBlockRendererOptions,
}: SyncedBlockRendererProps) => {
	const { syncBlockInstance } = useFetchSyncBlockData();

	const dataProviders = useMemo(() => {
		return convertSyncBlockRendererDataProvidersToProviderFactory(syncBlockRendererDataProviders);
	}, [syncBlockRendererDataProviders]);

	if (!syncBlockInstance) {
		return <SyncedBlockLoadingState />;
	}

	if (syncBlockInstance.error || !syncBlockInstance.data) {
		return (
			<SyncedBlockErrorComponent
				error={syncBlockInstance.error ?? SyncBlockError.Errored}
				resourceId={syncBlockInstance.resourceId}
			/>
		);
	}

	const syncBlockDoc: DocNode = {
		content: syncBlockInstance.data.content,
		version: 1,
		type: 'doc',
	} as DocNode;

	return (
		<AKRendererWrapper
			doc={syncBlockDoc}
			dataProviders={dataProviders}
			options={syncBlockRendererOptions}
		/>
	);
};

export const SyncedBlockRenderer = memo(SyncedBlockRendererComponent);
