import React from 'react';

import { SyncBlockSharedCssClassName } from '@atlaskit/editor-common/sync-block';
import type { FetchSyncBlockDataResult } from '@atlaskit/editor-synced-block-provider';

import type { SyncedBlockRendererProps } from '../syncedBlockPluginType';

import { SyncBlockLabel } from './SyncBlockLabel';

type Props = {
	getSyncedBlockRenderer: (props: SyncedBlockRendererProps) => React.JSX.Element;
	useFetchSyncBlockData: () => FetchSyncBlockDataResult | null;
};

const SyncBlockRendererWrapperDataId = 'sync-block-plugin-renderer-wrapper';

const SyncBlockRendererWrapperComponent = ({
	getSyncedBlockRenderer,
	useFetchSyncBlockData,
}: Props) => {
	return (
		<div>
			<SyncBlockLabel />
			<div
				data-testid={SyncBlockRendererWrapperDataId}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className={SyncBlockSharedCssClassName.renderer}
			>
				{getSyncedBlockRenderer({
					useFetchSyncBlockData,
				})}
			</div>
		</div>
	);
};

export const SyncBlockRendererWrapper = React.memo(SyncBlockRendererWrapperComponent);
