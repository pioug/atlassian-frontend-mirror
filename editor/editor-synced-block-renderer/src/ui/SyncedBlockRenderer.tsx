import React, { memo } from 'react';

import type { DocNode } from '@atlaskit/adf-schema';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { SyncedBlockPlugin } from '@atlaskit/editor-plugin-synced-block';
import {
	SyncBlockError,
	type UseFetchSyncBlockDataResult,
} from '@atlaskit/editor-synced-block-provider';

import type { SyncedBlockRendererOptions } from '../types';

import { AKRendererWrapper } from './AKRendererWrapper';
import { SyncedBlockErrorComponent } from './SyncedBlockErrorComponent';
import { SyncedBlockLoadingState } from './SyncedBlockLoadingState';

export type SyncedBlockRendererProps = {
	api?: ExtractInjectionAPI<SyncedBlockPlugin>;
	syncBlockRendererOptions: SyncedBlockRendererOptions | undefined;
	useFetchSyncBlockData: () => UseFetchSyncBlockDataResult;
};

const SyncedBlockRendererComponent = ({
	useFetchSyncBlockData,
	syncBlockRendererOptions,
	api,
}: SyncedBlockRendererProps): React.JSX.Element => {
	const { syncBlockInstance, providerFactory, isLoading, reloadData } = useFetchSyncBlockData();
	const { isInternetOffline } = useSharedPluginStateWithSelector(
		api,
		['connectivity'],
		({ connectivityState }) => ({
			isInternetOffline: connectivityState?.mode === 'collab-offline'
		})
	);

	if (isInternetOffline) {
		return (
			<SyncedBlockErrorComponent error={SyncBlockError.Offline} />
		);
	}

	if (!syncBlockInstance) {
		return <SyncedBlockLoadingState />;
	}

	if (syncBlockInstance.error || !syncBlockInstance.data) {
		return (
			<SyncedBlockErrorComponent
				error={syncBlockInstance.error ?? SyncBlockError.Errored}
				resourceId={syncBlockInstance.resourceId}
				onRetry={reloadData}
				isLoading={isLoading}
				fireAnalyticsEvent={api?.analytics?.actions.fireAnalyticsEvent}
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
