import React from 'react';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import {
	useHandleContentChanges,
	type SyncBlockDataProvider,
} from '@atlaskit/editor-synced-block-provider';

import { SyncBlockLabel } from './SyncBlockLabel';

interface BodiedSyncBlockWrapperProps {
	dataProvider?: SyncBlockDataProvider | undefined;
	node: PMNode;
}

export const BodiedSyncBlockWrapper: React.ForwardRefExoticComponent<
	BodiedSyncBlockWrapperProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, BodiedSyncBlockWrapperProps>(({ node, dataProvider }, ref) => {
	// TODO: EDITOR-2429 - this should be debounced (either here or in the data provider) to avoid excessive API writes
	const docJSON = {
		version: 1,
		type: 'doc',
		content: node.content.toJSON(),
	};
	useHandleContentChanges(docJSON, true, node, dataProvider);

	return (
		<div>
			<SyncBlockLabel />
			<div data-testid="bodied-sync-block-wrapper" ref={ref} />
		</div>
	);
});
