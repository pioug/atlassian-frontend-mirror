import React from 'react';

import { SyncBlockSharedCssClassName } from '@atlaskit/editor-common/sync-block';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import {
	SyncBlockError,
	useFetchSyncBlockData,
	useFetchSyncBlockTitle,
} from '@atlaskit/editor-synced-block-provider';
import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';

import type { SyncedBlockPlugin, SyncedBlockRendererProps } from '../syncedBlockPluginType';

import { SyncBlockLabel } from './SyncBlockLabel';

type Props = {
	api?: ExtractInjectionAPI<SyncedBlockPlugin>;
	localId: string;
	node: PMNode;
	resourceId: string;
	syncBlockStore: SyncBlockStoreManager;
	syncedBlockRenderer: (props: SyncedBlockRendererProps) => React.JSX.Element;
};

const SyncBlockRendererWrapperDataId = 'sync-block-plugin-renderer-wrapper';

const SyncBlockRendererWrapperComponent = ({
	syncedBlockRenderer,
	syncBlockStore,
	node,
	resourceId,
	localId,
	api,
}: Props): React.JSX.Element => {
	const syncBlockFetchResult = useFetchSyncBlockData(
		syncBlockStore,
		resourceId,
		localId,
		api?.analytics?.actions?.fireAnalyticsEvent,
	);
	const title = useFetchSyncBlockTitle(syncBlockStore, node);

	const contentUpdatedAt = syncBlockFetchResult?.syncBlockInstance?.data?.contentUpdatedAt;
	const isUnpublishedBlock = syncBlockFetchResult.syncBlockInstance?.data?.status === 'unpublished';
	const isUnsyncedBlock =
		isUnpublishedBlock ||
		syncBlockFetchResult?.syncBlockInstance?.error?.type === SyncBlockError.NotFound;

	return (
		<div>
			<div
				data-testid={SyncBlockRendererWrapperDataId}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className={SyncBlockSharedCssClassName.renderer}
			>
				{syncedBlockRenderer({
					syncBlockFetchResult,
					api,
				})}
			</div>
			<SyncBlockLabel
				isSource={false}
				title={title}
				contentUpdatedAt={contentUpdatedAt}
				localId={localId}
				isUnsyncedBlock={isUnsyncedBlock}
			/>
		</div>
	);
};

export const SyncBlockRendererWrapper: React.MemoExoticComponent<
	({
		syncedBlockRenderer,
		syncBlockStore,
		node,
		resourceId,
		localId,
		api,
	}: Props) => React.JSX.Element
> = React.memo(SyncBlockRendererWrapperComponent);
