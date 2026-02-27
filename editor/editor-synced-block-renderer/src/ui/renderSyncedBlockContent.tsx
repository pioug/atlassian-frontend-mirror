import React from 'react';

import type { DocNode } from '@atlaskit/adf-schema';
import type { RendererSyncBlockEventPayload } from '@atlaskit/editor-common/analytics';
import { isSSR } from '@atlaskit/editor-common/core-utils';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { SyncBlockError, type SyncBlockInstance } from '@atlaskit/editor-synced-block-provider';

import type { SyncedBlockRendererOptions } from '../types';

import { AKRendererWrapper } from './AKRendererWrapper';
import { SyncedBlockErrorComponent } from './SyncedBlockErrorComponent';
import { SyncedBlockLoadingState } from './SyncedBlockLoadingState';

export type RenderSyncedBlockContentParams = {
	error?: SyncBlockInstance['error'];
	fireAnalyticsEvent?: (payload: RendererSyncBlockEventPayload) => void;
	isLoading: boolean;
	isOffline?: boolean;
	providerFactory: ProviderFactory | undefined;
	reloadData?: () => void;
	rendererOptions: SyncedBlockRendererOptions | undefined;
	resourceId?: string;
	syncBlockInstance: SyncBlockInstance | null | undefined;
};

/**
 * Shared rendering logic for synced block content used by both
 * SyncedBlockRenderer (editor mode) and SyncedBlockNodeComponentRenderer (renderer mode).
 *
 * Handles the common branching: loading -> SSR error -> error/deleted -> unpublished -> success.
 * Returns null if the caller should handle rendering itself (e.g. wrapping in a container div).
 */
export function renderSyncedBlockContent({
	syncBlockInstance,
	isLoading,
	rendererOptions,
	providerFactory,
	reloadData,
	fireAnalyticsEvent,
	resourceId,
	isOffline,
	error,
}: RenderSyncedBlockContentParams): { element: React.JSX.Element; isSuccess: boolean } {
	const isSSRMode = isSSR();

	if (isOffline && !isSSRMode) {
		return {
			element: <SyncedBlockErrorComponent error={{ type: SyncBlockError.Offline }} />,
			isSuccess: false,
		};
	}

	if (isLoading && !syncBlockInstance) {
		return { element: <SyncedBlockLoadingState />, isSuccess: false };
	}

	if (isSSRMode && syncBlockInstance?.error) {
		return { element: <SyncedBlockLoadingState />, isSuccess: false };
	}

	if (
		!resourceId ||
		syncBlockInstance?.error ||
		!syncBlockInstance?.data ||
		syncBlockInstance.data.status === 'deleted'
	) {
		const errorToDisplay =
			error ??
			syncBlockInstance?.error ??
			(syncBlockInstance?.data?.status === 'deleted'
				? { type: SyncBlockError.NotFound }
				: { type: SyncBlockError.Errored });

		return {
			element: (
				<SyncedBlockErrorComponent
					error={errorToDisplay}
					resourceId={resourceId}
					onRetry={reloadData}
					isLoading={isLoading}
					fireAnalyticsEvent={fireAnalyticsEvent}
				/>
			),
			isSuccess: false,
		};
	}

	if (syncBlockInstance?.data?.status === 'unpublished') {
		return {
			element: (
				<SyncedBlockErrorComponent
					error={{ type: SyncBlockError.Unpublished }}
					resourceId={resourceId}
					sourceURL={syncBlockInstance.data?.sourceURL}
					fireAnalyticsEvent={fireAnalyticsEvent}
				/>
			),
			isSuccess: false,
		};
	}

	const syncBlockDoc: DocNode = {
		content: syncBlockInstance.data.content,
		version: 1,
		type: 'doc',
	} as DocNode;

	return {
		element: (
			<AKRendererWrapper
				doc={syncBlockDoc}
				dataProviders={providerFactory}
				options={rendererOptions}
			/>
		),
		isSuccess: true,
	};
}
