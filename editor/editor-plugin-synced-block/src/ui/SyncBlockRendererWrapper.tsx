import React from 'react';

import { SyncBlockSharedCssClassName } from '@atlaskit/editor-common/sync-block';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { UseFetchSyncBlockDataResult } from '@atlaskit/editor-synced-block-provider';

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
	localId,
	useFetchSyncBlockTitle,
	api,
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
					api,
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
