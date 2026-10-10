import React, { memo, useEffect, useMemo } from 'react';

import { isSSR } from '@atlaskit/editor-common/is-ssr';
import { handleSSRErrorsAnalytics } from '@atlaskit/editor-common/sync-block/ssr_error';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/useSharedPluginStateWithSelector';
import type { SyncedBlockPlugin } from '@atlaskit/editor-plugin-synced-block/synced-block-plugin-type';
import type { UseFetchSyncBlockDataResult } from '@atlaskit/editor-synced-block-provider/useFetchSyncBlockData';
import type { MediaSSR } from '@atlaskit/renderer/media-options';

import type { SyncedBlockRendererOptions } from '../types';
import { renderSyncedBlockContent } from './renderSyncedBlockContent';

export type SyncedBlockRendererProps = {
	api?: ExtractInjectionAPI<SyncedBlockPlugin>;
	getAccountId?: () => string | null;
	/**
	 * `localId` of the reference node, used to prefix heading ids rendered inside
	 * the synced block content. Heading ids are only emitted when this is provided
	 * alongside `syncBlockRendererOptions.allowHeadingAnchorLinks`.
	 */
	localId?: string;
	syncBlockFetchResult: UseFetchSyncBlockDataResult;
	syncBlockRendererOptions?: SyncedBlockRendererOptions;
};

const SyncedBlockRendererComponent = ({
	syncBlockRendererOptions,
	syncBlockFetchResult,
	api,
	getAccountId,
	localId,
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
		getAccountId,
		headingIdPrefix: localId,
	});
	return result.element;
};

export const SyncedBlockRenderer: React.MemoExoticComponent<
	({
		syncBlockRendererOptions,
		syncBlockFetchResult,
		api,
		getAccountId,
		localId,
	}: SyncedBlockRendererProps) => React.JSX.Element
> = memo(SyncedBlockRendererComponent);
