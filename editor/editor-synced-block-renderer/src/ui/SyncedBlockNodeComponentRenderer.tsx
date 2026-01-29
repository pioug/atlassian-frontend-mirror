import React, { useMemo } from 'react';

import type { DocNode } from '@atlaskit/adf-schema';
import { isSSR } from '@atlaskit/editor-common/core-utils';
import {
	SyncBlockSharedCssClassName,
	SyncBlockRendererDataAttributeName,
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

	syncBlockStoreManager.referenceManager.updateFireAnalyticsEvent(fireAnalyticsEvent);

	const { syncBlockInstance, isLoading, reloadData, providerFactory, ssrProviders } =
		useFetchSyncBlockData(syncBlockStoreManager, resourceId, localId, fireAnalyticsEvent);

	const finalRendererOptions = useMemo(() => {
		if (
			!isSSR() ||
			rendererOptions?.media?.ssr || // already has ssr config
			!ssrProviders?.media?.viewMediaClientConfig ||
			!fg('platform_synced_block_dogfooding')
		) {
			return rendererOptions;
		}

		const mediaSSR = {
			mode: 'server' as const,
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
	if (isSSR() && syncBlockInstance?.error && fg('platform_synced_block_dogfooding')) {
		return <SyncedBlockLoadingState />;
	}

	if (
		!resourceId ||
		syncBlockInstance?.error ||
		!syncBlockInstance?.data ||
		(syncBlockInstance.data.status === 'deleted' && fg('platform_synced_block_dogfooding'))
	) {
		return (
			<SyncedBlockErrorComponent
				error={
					syncBlockInstance?.error ??
					(syncBlockInstance?.data?.status === 'deleted' && fg('platform_synced_block_dogfooding')
						? { type: SyncBlockError.NotFound }
						: { type: SyncBlockError.Errored })
				}
				resourceId={syncBlockInstance?.resourceId}
				onRetry={reloadData}
				isLoading={isLoading}
				fireAnalyticsEvent={fireAnalyticsEvent}
			/>
		);
	}

	if (
		syncBlockInstance?.data?.status === 'unpublished' &&
		fg('platform_synced_block_dogfooding')
	) {
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
