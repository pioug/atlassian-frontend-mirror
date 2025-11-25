import React, { memo } from 'react';

import type { DocNode } from '@atlaskit/adf-schema';
import {
	SyncBlockError,
	type UseFetchSyncBlockDataResult,
} from '@atlaskit/editor-synced-block-provider';

import type { SyncedBlockRendererOptions } from '../types';

import { AKRendererWrapper } from './AKRendererWrapper';
import { SyncedBlockErrorComponent } from './SyncedBlockErrorComponent';
import { SyncedBlockLoadingState } from './SyncedBlockLoadingState';

export type SyncedBlockRendererProps = {
	syncBlockRendererOptions: SyncedBlockRendererOptions | undefined;
	useFetchSyncBlockData: () => UseFetchSyncBlockDataResult;
};

const SyncedBlockRendererComponent = ({
	useFetchSyncBlockData,
	syncBlockRendererOptions,
}: SyncedBlockRendererProps) => {
	const { syncBlockInstance, providerFactory, isLoading, reloadData } = useFetchSyncBlockData();

	if (!syncBlockInstance) {
		return <SyncedBlockLoadingState />;
	}

	if (syncBlockInstance.error || !syncBlockInstance.data) {
		return (
			<SyncedBlockErrorComponent
				error={syncBlockInstance.error ?? SyncBlockError.Errored}
				sourceAri={syncBlockInstance.data?.sourceAri}
				sourceProduct={syncBlockInstance.data?.product}
				onRetry={reloadData}
				isLoading={isLoading}
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
			dataProviders={providerFactory}
			options={syncBlockRendererOptions}
		/>
	);
};

export const SyncedBlockRenderer = memo(SyncedBlockRendererComponent);
