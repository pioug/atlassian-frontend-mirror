import React, { memo, useMemo } from 'react';

import type { DocNode } from '@atlaskit/adf-schema';
import { isSSR } from '@atlaskit/editor-common/core-utils';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { SyncedBlockPlugin } from '@atlaskit/editor-plugin-synced-block';
import {
	SyncBlockError,
	type UseFetchSyncBlockDataResult,
} from '@atlaskit/editor-synced-block-provider';
import { fg } from '@atlaskit/platform-feature-flags';
import type { MediaSSR } from '@atlaskit/renderer';

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
	const { syncBlockInstance, providerFactory, isLoading, reloadData, ssrProviders } =
		useFetchSyncBlockData();

	const rendererOptions = useMemo(() => {
		if (
			!isSSR() ||
			syncBlockRendererOptions?.media?.ssr || // already has ssr config
			!ssrProviders?.media?.viewMediaClientConfig ||
			!fg('platform_synced_block_dogfooding')
		) {
			return syncBlockRendererOptions;
		}

		const mediaSSR = {
			mode: 'server' as const,
			config: ssrProviders?.media.viewMediaClientConfig,
		} as MediaSSR;

		return {
			...syncBlockRendererOptions,
			media: {
				...(syncBlockRendererOptions?.media || {}),
				ssr: mediaSSR,
			},
		};
	}, [syncBlockRendererOptions, ssrProviders]);

	const { isInternetOffline } = useSharedPluginStateWithSelector(
		api,
		['connectivity'],
		({ connectivityState }) => ({
			isInternetOffline: connectivityState?.mode === 'collab-offline',
		}),
	);

	if (isInternetOffline) {
		return <SyncedBlockErrorComponent error={SyncBlockError.Offline} />;
	}

	if (!syncBlockInstance) {
		return <SyncedBlockLoadingState />;
	}

	if (syncBlockInstance.error || !syncBlockInstance.data || (syncBlockInstance.data.status === 'deleted' && fg('platform_synced_block_dogfooding'))) {
		return (
			<SyncedBlockErrorComponent
				error={syncBlockInstance.error ?? (syncBlockInstance?.data?.status === 'deleted' && fg('platform_synced_block_dogfooding') ? SyncBlockError.NotFound : SyncBlockError.Errored)}
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
			options={rendererOptions}
		/>
	);
};

export const SyncedBlockRenderer = memo(SyncedBlockRendererComponent);
