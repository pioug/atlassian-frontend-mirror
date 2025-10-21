import React from 'react';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import {
	type SyncBlockStoreManager,
	useHandleContentChanges,
} from '@atlaskit/editor-synced-block-provider';

import { SyncBlockLabel } from './SyncBlockLabel';

interface BodiedSyncBlockWrapperProps {
	node: PMNode;
	syncBlockStore: SyncBlockStoreManager;
}

export const BodiedSyncBlockWrapper: React.ForwardRefExoticComponent<
	BodiedSyncBlockWrapperProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, BodiedSyncBlockWrapperProps>(
	({ node, syncBlockStore }, ref) => {
		// TODO: EDITOR-2429 - this should be debounced (either here or in the data provider) to avoid excessive API writes
		useHandleContentChanges(syncBlockStore, node);

		return (
			<div>
				<SyncBlockLabel />
				<div data-testid="bodied-sync-block-wrapper" ref={ref} />
			</div>
		);
	},
);
