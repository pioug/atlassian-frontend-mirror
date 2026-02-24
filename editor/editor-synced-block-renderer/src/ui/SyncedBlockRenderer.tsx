import React, { memo, useEffect, useMemo } from 'react';

import type { DocNode } from '@atlaskit/adf-schema';
import { isSSR } from '@atlaskit/editor-common/core-utils';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { handleSSRErrorsAnalytics } from '@atlaskit/editor-common/sync-block';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { SyncedBlockPlugin } from '@atlaskit/editor-plugin-synced-block';
import {
	SyncBlockError,
	type UseFetchSyncBlockDataResult,
} from '@atlaskit/editor-synced-block-provider';
import type { MediaSSR } from '@atlaskit/renderer';

import type { SyncedBlockRendererOptions } from '../types';

import { AKRendererWrapper } from './AKRendererWrapper';
import { SyncedBlockErrorComponent } from './SyncedBlockErrorComponent';
import { SyncedBlockLoadingState } from './SyncedBlockLoadingState';

export type SyncedBlockRendererProps = {
	api?: ExtractInjectionAPI<SyncedBlockPlugin>;
	syncBlockFetchResult: UseFetchSyncBlockDataResult;
	syncBlockRendererOptions?: SyncedBlockRendererOptions;
};

const SyncedBlockRendererComponent = ({
	syncBlockRendererOptions,
	syncBlockFetchResult,
	api,
}: SyncedBlockRendererProps): React.JSX.Element => {
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			handleSSRErrorsAnalytics(api?.analytics?.actions.fireAnalyticsEvent);
		}, 0);

		return () => {
			clearTimeout(timeoutId);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const { isLoading, providerFactory, reloadData, ssrProviders, syncBlockInstance } =
		syncBlockFetchResult;

	const isSSRMode = isSSR();

	const rendererOptions = useMemo(() => {
		if (
			!isSSRMode ||
			syncBlockRendererOptions?.media?.ssr || // already has ssr config
			!ssrProviders?.media?.viewMediaClientConfig
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
	}, [syncBlockRendererOptions, ssrProviders, isSSRMode]);

	const { isCollabOffline } = useSharedPluginStateWithSelector(
		api,
		['connectivity'],
		({ connectivityState }) => ({
			isCollabOffline: connectivityState?.mode === 'collab-offline',
		}),
	);

	// Show offline error only when collaboration is offline and not in SSR mode
	// In SSR, we should always attempt to render content
	if (isCollabOffline && !isSSRMode) {
		return <SyncedBlockErrorComponent error={{ type: SyncBlockError.Offline }} />;
	}

	if (!syncBlockInstance) {
		return <SyncedBlockLoadingState />;
	}

	// In SSR, if server returned error, we should render loading state instead of error state
	// since  FE will do another fetch and render the error state or proper data then
	if (isSSRMode && syncBlockInstance.error) {
		return <SyncedBlockLoadingState />;
	}

	if (
		syncBlockInstance.error ||
		!syncBlockInstance.data ||
		syncBlockInstance.data.status === 'deleted'
	) {
		return (
			<SyncedBlockErrorComponent
				error={
					syncBlockInstance.error ??
					(syncBlockInstance?.data?.status === 'deleted'
						? { type: SyncBlockError.NotFound }
						: { type: SyncBlockError.Errored })
				}
				resourceId={syncBlockInstance.resourceId}
				onRetry={reloadData}
				isLoading={isLoading}
				fireAnalyticsEvent={api?.analytics?.actions.fireAnalyticsEvent}
			/>
		);
	}

	// Check for unpublished status
	if (syncBlockInstance.data?.status === 'unpublished') {
		return (
			<SyncedBlockErrorComponent
				error={{ type: SyncBlockError.Unpublished }}
				resourceId={syncBlockInstance.resourceId}
				sourceURL={syncBlockInstance.data?.sourceURL}
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
