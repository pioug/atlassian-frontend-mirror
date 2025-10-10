import React from 'react';

import type { DocNode } from '@atlaskit/adf-schema';
import { SyncBlockSharedCssClassName } from '@atlaskit/editor-common/sync-block';

import type { SyncedBlockRendererProps } from '../syncedBlockPluginType';

import { SyncBlockLabel } from './SyncBlockLabel';

type Props = {
	getSyncedBlockRenderer: (props: SyncedBlockRendererProps) => React.JSX.Element;
	useFetchDocNode: () => DocNode;
};

const SyncBlockRendererWrapperDataId = 'sync-block-plugin-renderer-wrapper';

const SyncBlockRendererWrapperComponent = ({ getSyncedBlockRenderer, useFetchDocNode }: Props) => {
	return (
		<div>
			<SyncBlockLabel />
			<div
				data-testid={SyncBlockRendererWrapperDataId}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className={SyncBlockSharedCssClassName.renderer}
			>
				{getSyncedBlockRenderer({
					useFetchDocNode,
				})}
			</div>
		</div>
	);
};

export const SyncBlockRendererWrapper = React.memo(SyncBlockRendererWrapperComponent);
