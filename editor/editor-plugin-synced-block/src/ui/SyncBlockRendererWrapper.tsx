import React from 'react';

import type { SyncedBlockRendererDataProviders } from '@atlaskit/editor-common/provider-factory';
import { SyncBlockSharedCssClassName } from '@atlaskit/editor-common/sync-block';
import type { SyncBlockInstance } from '@atlaskit/editor-synced-block-provider';

import type { SyncedBlockRendererProps } from '../syncedBlockPluginType';

import { SyncBlockLabel } from './SyncBlockLabel';

type Props = {
	getSyncedBlockRenderer: (props: SyncedBlockRendererProps) => React.JSX.Element;
	localId: string;
	syncBlockRendererDataProviders: SyncedBlockRendererDataProviders;
	useFetchSyncBlockData: () => SyncBlockInstance | null;
	useFetchSyncBlockTitle: () => string | undefined;
};

const SyncBlockRendererWrapperDataId = 'sync-block-plugin-renderer-wrapper';

const SyncBlockRendererWrapperComponent = ({
	getSyncedBlockRenderer,
	useFetchSyncBlockData,
	syncBlockRendererDataProviders,
	localId,
	useFetchSyncBlockTitle,
}: Props) => {
	return (
		<div>
			<div
				data-testid={SyncBlockRendererWrapperDataId}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className={SyncBlockSharedCssClassName.renderer}
			>
				{getSyncedBlockRenderer({
					syncBlockRendererDataProviders,
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
