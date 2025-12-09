import React from 'react';

import { SyncBlockSharedCssClassName } from '@atlaskit/editor-common/sync-block';
import type { UseFetchSyncBlockDataResult } from '@atlaskit/editor-synced-block-provider';

import type { SyncedBlockRendererProps } from '../syncedBlockPluginType';

import { SyncBlockLabel } from './SyncBlockLabel';

type Props = {
	syncedBlockRenderer: (props: SyncedBlockRendererProps) => React.JSX.Element;
	localId: string;
	useFetchSyncBlockData: () => UseFetchSyncBlockDataResult;
	useFetchSyncBlockTitle: () => string | undefined;
};

const SyncBlockRendererWrapperDataId = 'sync-block-plugin-renderer-wrapper';

const SyncBlockRendererWrapperComponent = ({
	syncedBlockRenderer,
	useFetchSyncBlockData,
	localId,
	useFetchSyncBlockTitle,
}: Props): React.JSX.Element => {
	return (
		<div>
			<div
				data-testid={SyncBlockRendererWrapperDataId}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className={SyncBlockSharedCssClassName.renderer}
			>
				{syncedBlockRenderer({
					useFetchSyncBlockData,
				})}
			</div>
			<SyncBlockLabel
				isSource={false}
				useFetchSyncBlockTitle={useFetchSyncBlockTitle}
				localId={localId}
			/>
		</div>
	);
};

export const SyncBlockRendererWrapper = React.memo(SyncBlockRendererWrapperComponent);
