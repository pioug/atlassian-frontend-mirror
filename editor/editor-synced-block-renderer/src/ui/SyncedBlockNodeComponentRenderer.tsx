import React from 'react';

import type { DocNode } from '@atlaskit/adf-schema';
import { SyncBlockSharedCssClassName } from '@atlaskit/editor-common/sync-block';
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
	const { resourceId, localId, fireAnalyticsEvent } = nodeProps;

	syncBlockStoreManager.referenceManager.updateFireAnalyticsEvent(fireAnalyticsEvent);

	const { syncBlockInstance, isLoading, reloadData, providerFactory } = useFetchSyncBlockData(
		syncBlockStoreManager,
		resourceId,
		localId,
		fireAnalyticsEvent,
	);

	if (isLoading && !syncBlockInstance) {
		return <SyncedBlockLoadingState />;
	}

	if (!resourceId || syncBlockInstance?.error || !syncBlockInstance?.data) {
		return (
			<SyncedBlockErrorComponent
				error={syncBlockInstance?.error ?? SyncBlockError.Errored}
				resourceId={syncBlockInstance?.resourceId}
				onRetry={reloadData}
				isLoading={isLoading}
				fireAnalyticsEvent={fireAnalyticsEvent}
			/>
		);
	}

	const syncBlockDoc = {
		content: syncBlockInstance.data.content,
		version: 1,
		type: 'doc',
	} as DocNode;

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
		<div className={SyncBlockSharedCssClassName.renderer} data-sync-block-renderer>
			<AKRendererWrapper
				doc={syncBlockDoc}
				dataProviders={providerFactory}
				options={rendererOptions}
			/>
		</div>
	);
};
