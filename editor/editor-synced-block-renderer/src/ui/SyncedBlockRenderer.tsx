import React, { memo, useEffect, useMemo } from 'react';

import { isSSR } from '@atlaskit/editor-common/core-utils';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { handleSSRErrorsAnalytics } from '@atlaskit/editor-common/sync-block';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { SyncedBlockPlugin } from '@atlaskit/editor-plugin-synced-block';
import type { UseFetchSyncBlockDataResult } from '@atlaskit/editor-synced-block-provider';
import type { MediaSSR } from '@atlaskit/renderer';

import type { SyncedBlockRendererOptions } from '../types';

import { renderSyncedBlockContent } from './renderSyncedBlockContent';

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

	const { isCollabOffline, contentMode } = useSharedPluginStateWithSelector(
		api,
		['connectivity', 'contentFormat'],
		({ connectivityState, contentFormatState }) => ({
			isCollabOffline: connectivityState?.mode === 'collab-offline',
			contentMode: contentFormatState?.contentMode,
		}),
	);

	const result = renderSyncedBlockContent({
		syncBlockInstance,
		isLoading,
		rendererOptions: contentMode ? { ...rendererOptions, contentMode } : rendererOptions,
		providerFactory,
		reloadData,
		fireAnalyticsEvent: api?.analytics?.actions.fireAnalyticsEvent,
		resourceId: syncBlockInstance?.resourceId,
		isOffline: isCollabOffline,
	});
	return result.element;
};

export const SyncedBlockRenderer: React.MemoExoticComponent<
	({
		syncBlockRendererOptions,
		syncBlockFetchResult,
		api,
	}: SyncedBlockRendererProps) => React.JSX.Element
> = memo(SyncedBlockRendererComponent);
