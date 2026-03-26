import { useEffect, useRef, useState } from 'react';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { SyncBlockStoreManager } from '../store-manager/syncBlockStoreManager';

export const useFetchSyncBlockTitle = (
	manager: SyncBlockStoreManager,
	syncBlockNode: PMNode,
): string | undefined => {
	const nodeRef = useRef(syncBlockNode);
	nodeRef.current = syncBlockNode;

	const nodeTypeName = syncBlockNode.type.name;
	const resourceId: string | undefined = syncBlockNode.attrs?.resourceId;
	const localId: string | undefined = syncBlockNode.attrs?.localId;

	// Initialize state from cache to prevent flickering during re-renders
	const [sourceTitle, setSourceTitle] = useState<string | undefined>(() => {
		if (nodeTypeName !== 'syncBlock') {
			return undefined;
		}
		if (!resourceId) {
			return undefined;
		}
		const cachedData = manager.referenceManager.getFromCache(resourceId);
		return cachedData?.data?.sourceTitle;
	});

	useEffect(() => {
		const unsubscribe = manager.referenceManager.subscribeToSourceTitle(
			nodeRef.current,
			(title: string) => {
				setSourceTitle(title);
			},
		);

		return () => {
			unsubscribe();
		};
	}, [manager, nodeTypeName, resourceId, localId]);

	return sourceTitle;
};
