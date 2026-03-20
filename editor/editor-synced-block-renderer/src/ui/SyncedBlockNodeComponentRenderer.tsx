import React, { useEffect, useMemo } from 'react';

import { isSSR } from '@atlaskit/editor-common/core-utils';
import {
	SyncBlockSharedCssClassName,
	SyncBlockRendererDataAttributeName,
	handleSSRErrorsAnalytics,
} from '@atlaskit/editor-common/sync-block';
import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';
import { SyncBlockError, useFetchSyncBlockData } from '@atlaskit/editor-synced-block-provider';
import { type MediaSSR, type NodeProps } from '@atlaskit/renderer';

import type { SyncedBlockRendererOptions } from '../types';

import { renderSyncedBlockContent } from './renderSyncedBlockContent';

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

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			handleSSRErrorsAnalytics(fireAnalyticsEvent);
		}, 0);

		return () => {
			clearTimeout(timeoutId);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		syncBlockStoreManager.referenceManager.updateFireAnalyticsEvent(fireAnalyticsEvent);
	}, [syncBlockStoreManager.referenceManager, fireAnalyticsEvent]);

	const { syncBlockInstance, isLoading, reloadData, providerFactory, ssrProviders } =
		useFetchSyncBlockData(syncBlockStoreManager, resourceId, localId, fireAnalyticsEvent);

	const finalRendererOptions = useMemo(() => {
		if (
			rendererOptions?.media?.ssr || // already has ssr config
			!ssrProviders?.media?.viewMediaClientConfig
		) {
			return rendererOptions;
		}

		const mediaSSR = {
			// Use synced block's media config so auth uses source contentId, not current page.
			// Server: during SSR; client: after hydration (avoids using page's MediaClient).
			mode: isSSR() ? 'server' : 'client',
			config: ssrProviders?.media.viewMediaClientConfig,
		} as MediaSSR;

		return {
			...rendererOptions,
			media: {
				...(rendererOptions?.media || {}),
				ssr: mediaSSR,
			},
		};
	}, [rendererOptions, ssrProviders]);

	const errorForDisplay =
		syncBlockInstance?.error ??
		(syncBlockInstance?.data?.status === 'deleted'
			? { type: SyncBlockError.NotFound, reason: syncBlockInstance.data?.deletionReason }
			: {
					type: SyncBlockError.Errored,
					reason: !resourceId ? 'missing resource id' : `missing data for block ${resourceId}`,
				});
	const result = renderSyncedBlockContent({
		syncBlockInstance: syncBlockInstance ?? undefined,
		isLoading,
		rendererOptions: finalRendererOptions,
		providerFactory,
		reloadData,
		fireAnalyticsEvent,
		resourceId,
		error: errorForDisplay,
	});
	if (result.isSuccess) {
		return (
			<div
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className={SyncBlockSharedCssClassName.renderer}
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...{ [SyncBlockRendererDataAttributeName]: true }}
			>
				{result.element}
			</div>
		);
	}
	return result.element;
};
