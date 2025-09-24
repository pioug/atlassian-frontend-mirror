import React from 'react';

import type { DocNode } from '@atlaskit/adf-schema';
import { ReactRenderer } from '@atlaskit/renderer';
import { RendererActionsContext } from '@atlaskit/renderer/actions';

export type SyncedBlockRendererProps = {
	useFetchDocNode: () => DocNode;
};

const SyncedBlockRenderer = ({ useFetchDocNode }: SyncedBlockRendererProps) => {
	const latestDocNode = useFetchDocNode();

	return (
		<RendererActionsContext>
			<div data-testid="sync-block-renderer-wrapper">
				<ReactRenderer appearance="full-width" adfStage="stage0" document={latestDocNode} />
			</div>
		</RendererActionsContext>
	);
};

export const getSyncedBlockRenderer = (props: SyncedBlockRendererProps): React.JSX.Element => {
	return <SyncedBlockRenderer useFetchDocNode={props.useFetchDocNode} />;
};
