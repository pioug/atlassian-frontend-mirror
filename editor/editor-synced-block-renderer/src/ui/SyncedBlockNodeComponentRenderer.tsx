import React, { useEffect, useMemo } from 'react';

import type { DocNode } from '@atlaskit/adf-schema';
import { isSSR } from '@atlaskit/editor-common/core-utils';
import {
	SyncBlockSharedCssClassName,
	SyncBlockRendererDataAttributeName,
	handleSSRErrorsAnalytics,
} from '@atlaskit/editor-common/sync-block';
import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';
import { SyncBlockError, useFetchSyncBlockData } from '@atlaskit/editor-synced-block-provider';
import { fg } from '@atlaskit/platform-feature-flags';
import { type MediaSSR, type NodeProps } from '@atlaskit/renderer';

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
			(!isSSR() && !fg('platform_synced_block_patch_4')) ||
			rendererOptions?.media?.ssr || // already has ssr config
			!ssrProviders?.media?.viewMediaClientConfig
		) {
			return rendererOptions;
		}

		const mediaSSR = {
			// Use synced block's media config so auth uses source contentId, not current page.
			// Server: during SSR; client: after hydration (avoids using page's MediaClient).
			mode: fg('platform_synced_block_patch_4')
				? isSSR()
					? 'server'
					: 'client'
				: ('server' as const),
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

	if (isLoading && !syncBlockInstance) {
		return <SyncedBlockLoadingState />;
	}

	// In SSR, if server returned error, we should render loading state instead of error state
	// since  FE will do another fetch and render the error state or proper data then
	if (isSSR() && syncBlockInstance?.error) {
		return <SyncedBlockLoadingState />;
	}

	if (
		!resourceId ||
		syncBlockInstance?.error ||
		!syncBlockInstance?.data ||
		syncBlockInstance.data.status === 'deleted'
	) {
		const errorMessage =
			syncBlockInstance?.error ??
			(syncBlockInstance?.data?.status === 'deleted'
				? { type: SyncBlockError.NotFound, reason: syncBlockInstance.data?.deletionReason }
				: {
						type: SyncBlockError.Errored,
						reason: !resourceId ? 'missing resource id' : `missing data for block ${resourceId}`,
					});
		return (
			<SyncedBlockErrorComponent
				error={
					fg('platform_synced_block_patch_3')
						? errorMessage
						: (syncBlockInstance?.error ??
							(syncBlockInstance?.data?.status === 'deleted'
								? { type: SyncBlockError.NotFound }
								: { type: SyncBlockError.Errored }))
				}
				resourceId={syncBlockInstance?.resourceId}
				onRetry={reloadData}
				isLoading={isLoading}
				fireAnalyticsEvent={fireAnalyticsEvent}
			/>
		);
	}

	if (syncBlockInstance?.data?.status === 'unpublished') {
		return (
			<SyncedBlockErrorComponent
				error={{ type: SyncBlockError.Unpublished }}
				resourceId={syncBlockInstance?.resourceId}
				sourceURL={syncBlockInstance.data?.sourceURL}
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
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={SyncBlockSharedCssClassName.renderer}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...{ [SyncBlockRendererDataAttributeName]: true }}
		>
			<AKRendererWrapper
				doc={syncBlockDoc}
				dataProviders={providerFactory}
				options={finalRendererOptions}
			/>
		</div>
	);
};
