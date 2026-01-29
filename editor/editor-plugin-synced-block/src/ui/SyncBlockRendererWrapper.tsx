import React from 'react';

import { SyncBlockSharedCssClassName } from '@atlaskit/editor-common/sync-block';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	SyncBlockError,
	type UseFetchSyncBlockDataResult,
} from '@atlaskit/editor-synced-block-provider';

import type { SyncedBlockPlugin, SyncedBlockRendererProps } from '../syncedBlockPluginType';

import { SyncBlockLabel } from './SyncBlockLabel';

type Props = {
	api?: ExtractInjectionAPI<SyncedBlockPlugin>;
	localId: string;
	syncedBlockRenderer: (props: SyncedBlockRendererProps) => React.JSX.Element;
	useFetchSyncBlockData: () => UseFetchSyncBlockDataResult;
	useFetchSyncBlockTitle: () => string | undefined;
};

const SyncBlockRendererWrapperDataId = 'sync-block-plugin-renderer-wrapper';

const SyncBlockRendererWrapperComponent = ({
	syncedBlockRenderer,
	useFetchSyncBlockData,
	useFetchSyncBlockTitle,
	localId,
	api,
}: Props): React.JSX.Element => {
	const syncBlockFetchResult = useFetchSyncBlockData();
	const title = useFetchSyncBlockTitle?.();

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

export const SyncBlockRendererWrapper = React.memo(SyncBlockRendererWrapperComponent);
