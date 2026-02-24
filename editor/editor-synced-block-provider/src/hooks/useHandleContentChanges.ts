import { useEffect } from 'react';

import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { SyncBlockStoreManager } from '../store-manager/syncBlockStoreManager';

export const useHandleContentChanges = (
	manager: SyncBlockStoreManager,
	syncBlockNode: PMNode,
): void => {
	// syncBlockNode is intentionally in deps — its reference changes when the
	// node content is modified by a ProseMirror transaction, which is exactly
	// when the source manager cache needs to be updated.
	useEffect(() => {
		manager.sourceManager.updateSyncBlockData(syncBlockNode);
	}, [manager, syncBlockNode]);
};
