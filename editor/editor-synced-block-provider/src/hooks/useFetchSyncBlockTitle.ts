import { useEffect, useState } from 'react';

import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { SyncBlockStoreManager } from '../store-manager/syncBlockStoreManager';

export const useFetchSyncBlockTitle = (
	manager: SyncBlockStoreManager,
	syncBlockNode: PMNode,
): string | undefined => {
	// Initialize state from cache to prevent flickering during re-renders
	const [sourceTitle, setSourceTitle] = useState<string | undefined>(() => {
		if (syncBlockNode.type.name !== 'syncBlock') {
			return undefined;
		}
		const { resourceId } = syncBlockNode.attrs;
		if (!resourceId) {
			return undefined;
		}
		const cachedData = manager.referenceManager.getFromCache(resourceId);
		return cachedData?.data?.sourceTitle;
	});

	useEffect(() => {
		const unsubscribe = manager.referenceManager.subscribeToSourceTitle(
			syncBlockNode,
			(title: string) => {
				setSourceTitle(title);
			},
		);

		return () => {
			unsubscribe();
		};
	}, [manager, syncBlockNode]);

	return sourceTitle;
};
