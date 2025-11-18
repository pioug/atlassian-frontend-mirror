import React from 'react';

import type { DocNode } from '@atlaskit/adf-schema';
import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';
import { SyncBlockError, useFetchSyncBlockData } from '@atlaskit/editor-synced-block-provider';
import { type NodeProps } from '@atlaskit/renderer';

import type { SyncedBlockRendererOptions } from '../types';

import { AKRendererWrapper } from './AKRendererWrapper';
import { SyncedBlockErrorComponent } from './SyncedBlockErrorComponent';
import { SyncedBlockLoadingState } from './SyncedBlockLoadingState';

export interface SyncedBlockProps {
	localId?: string;
	resourceId?: string;
}

export type SyncedBlockNodeProps = NodeProps<SyncedBlockProps>;

export type SyncedBlockNodeComponentRendererProps = {
	nodeProps: SyncedBlockNodeProps;
	rendererOptions: SyncedBlockRendererOptions | undefined;
	syncBlockStoreManager: SyncBlockStoreManager;
};

export const SyncedBlockNodeComponentRenderer = ({
	nodeProps,
	syncBlockStoreManager,
	rendererOptions,
}: SyncedBlockNodeComponentRendererProps): React.JSX.Element => {
	const { resourceId, localId } = nodeProps;

	const { syncBlockInstance, isLoading, reloadData, providerFactory } = useFetchSyncBlockData(
		syncBlockStoreManager,
		resourceId,
		localId,
	);

	if (isLoading && !syncBlockInstance) {
		return <SyncedBlockLoadingState />;
	}

	if (!resourceId || syncBlockInstance?.error || !syncBlockInstance?.data) {
		return (
			<SyncedBlockErrorComponent
				error={syncBlockInstance?.error ?? SyncBlockError.Errored}
				resourceId={resourceId}
				onRetry={reloadData}
				isLoading={isLoading}
				documentAri={syncBlockInstance?.data?.sourceDocumentAri}
			/>
		);
	}

	const syncBlockDoc = {
		content: syncBlockInstance.data.content,
		version: 1,
		type: 'doc',
	} as DocNode;

	return (
		<div data-sync-block-renderer>
			<AKRendererWrapper
				doc={syncBlockDoc}
				dataProviders={providerFactory}
				options={rendererOptions}
			/>
		</div>
	);
};
