import { useEffect, useRef, useState } from 'react';

import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';
import { conditionalHooksFactory } from '@atlaskit/platform-feature-flags-react';

import type { SyncBlockStoreManager } from '../store-manager/syncBlockStoreManager';

const useFetchSyncBlockTitleBase = (
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

const useFetchSyncBlockTitlePatched = (
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

export const useFetchSyncBlockTitle = conditionalHooksFactory(
	() => fg('platform_synced_block_patch_4'),
	useFetchSyncBlockTitlePatched,
	useFetchSyncBlockTitleBase,
);
