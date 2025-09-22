import React from 'react';

import type { DocNode } from '@atlaskit/adf-schema';
import { SyncBlockSharedCssClassName } from '@atlaskit/editor-common/sync-block';

import type { SyncedBlockRendererProps } from '../syncedBlockPluginType';

type Props = {
	docNode: DocNode;
	getSyncedBlockRenderer: (props: SyncedBlockRendererProps) => React.JSX.Element;
};

const SyncBlockRendererWrapperDataId = 'sync-block-plugin-renderer-wrapper';

const SyncBlockRendererWrapperComponent = ({ getSyncedBlockRenderer, docNode }: Props) => {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/design-system/ensure-design-token-usage
		<div
			data-testid={SyncBlockRendererWrapperDataId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={SyncBlockSharedCssClassName.renderer}
		>
			{getSyncedBlockRenderer({
				docNode,
			})}
		</div>
	);
};

export const SyncBlockRendererWrapper = React.memo(SyncBlockRendererWrapperComponent);
