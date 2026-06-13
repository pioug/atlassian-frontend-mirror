import React, { useEffect, useMemo } from 'react';

import type { RendererSyncBlockEventPayload } from '@atlaskit/editor-common/analytics';
import { isSSR } from '@atlaskit/editor-common/core-utils';
import {
	SyncBlockSharedCssClassName,
	SyncBlockRendererDataAttributeName,
	handleSSRErrorsAnalytics,
} from '@atlaskit/editor-common/sync-block';
import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';
import { SyncBlockError, useFetchSyncBlockData } from '@atlaskit/editor-synced-block-provider';
import type { MediaSSR, NodeProps } from '@atlaskit/renderer';

import type { SyncedBlockRendererOptions } from '../types';

import { renderSyncedBlockContent } from './renderSyncedBlockContent';

export interface SyncedBlockProps {
	localId?: string;
	resourceId?: string;
}

export type SyncedBlockNodeProps = NodeProps<SyncedBlockProps>;

export type SyncedBlockNodeComponentRendererProps = {
	getAccountId?: () => string | null;
	nodeProps: SyncedBlockNodeProps;
	rendererOptions: SyncedBlockRendererOptions | undefined;
	syncBlockStoreManager: SyncBlockStoreManager;
};

export const SyncedBlockNodeComponentRenderer = ({
	nodeProps,
	syncBlockStoreManager,
	rendererOptions,
	getAccountId,
}: SyncedBlockNodeComponentRendererProps): React.JSX.Element => {
	const { resourceId, localId, fireAnalyticsEvent } = nodeProps;
	// `fireAnalyticsEvent` from NodeProps is typed as the generic
	// `AnalyticsEventPayload`. The synced-block consumers below
	// (`updateFireAnalyticsEvent`, `useFetchSyncBlockData`, `renderSyncedBlockContent`)
	// only ever invoke it with the narrower `RendererSyncBlockEventPayload`
	// union, which is a strict subset of `AnalyticsEventPayload`, so the cast
	// is safe.
	const syncBlockFireAnalyticsEvent = fireAnalyticsEvent as
		| ((payload: RendererSyncBlockEventPayload) => void)
		| undefined;

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			// handleSSRErrorsAnalytics expects only `SyncedBlockSSRErrorAEP` — the
			// generic `fireAnalyticsEvent` from NodeProps is a superset, so the
			// cast is safe (the handler only ever calls back with that one AEP).
			handleSSRErrorsAnalytics(
				fireAnalyticsEvent as Parameters<typeof handleSSRErrorsAnalytics>[0],
			);
		}, 0);

		return () => {
			clearTimeout(timeoutId);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		syncBlockStoreManager.referenceManager.updateFireAnalyticsEvent(syncBlockFireAnalyticsEvent);
	}, [syncBlockStoreManager.referenceManager, syncBlockFireAnalyticsEvent]);

	const { syncBlockInstance, isLoading, reloadData, providerFactory, ssrProviders } =
		useFetchSyncBlockData(syncBlockStoreManager, resourceId, localId, syncBlockFireAnalyticsEvent);

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
		fireAnalyticsEvent: syncBlockFireAnalyticsEvent,
		resourceId,
		error: errorForDisplay,
		getAccountId,
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
