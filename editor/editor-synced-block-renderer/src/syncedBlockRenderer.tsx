import React from 'react';

import type { DocNode } from '@atlaskit/adf-schema';
import { ReactRenderer } from '@atlaskit/renderer';
import { RendererActionsContext } from '@atlaskit/renderer/actions';

export type SyncedBlockRendererProps = {
	docNode: DocNode;
};

const SyncedBlockRenderer = ({ docNode }: SyncedBlockRendererProps) => {
	return (
		<RendererActionsContext>
			<div data-testid="sync-block-renderer-wrapper">
				<ReactRenderer appearance="full-width" adfStage="stage0" document={docNode} />
			</div>
		</RendererActionsContext>
	);
};

export const getSyncedBlockRenderer = (props: SyncedBlockRendererProps): React.JSX.Element => {
	return <SyncedBlockRenderer docNode={props.docNode} />;
};
