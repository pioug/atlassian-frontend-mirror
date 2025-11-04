import { useEffect, useState } from 'react';

import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { SyncBlockStoreManager } from '../store-manager/syncBlockStoreManager';

export const useFetchSyncBlockTitle = (
	manager: SyncBlockStoreManager,
	syncBlockNode: PMNode,
): string | undefined => {
	const [sourceTitle, setSourceTitle] = useState<string | undefined>(undefined);

	useEffect(() => {
		const unsubscribe = manager.subscribeToSyncBlockSourceTitle(syncBlockNode, (title: string) => {
			setSourceTitle(title);
		});

		return () => {
			unsubscribe();
		};
	}, [manager, syncBlockNode]);

	return sourceTitle;
};
