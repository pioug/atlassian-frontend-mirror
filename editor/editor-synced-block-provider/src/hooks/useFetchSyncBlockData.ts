import { useCallback, useEffect, useState } from 'react';

import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { SyncBlockError } from '../common/types';
import type { FetchSyncBlockDataResult } from '../providers/types';
import type { SyncBlockStoreManager } from '../store-manager/syncBlockStoreManager';

export const useFetchSyncBlockData = (
	manager: SyncBlockStoreManager,
	syncBlockNode: PMNode,
): FetchSyncBlockDataResult | null => {
	const [fetchSyncBlockDataResult, setFetchSyncBlockDataResult] =
		useState<FetchSyncBlockDataResult | null>(null);
	const fetchSyncBlockNode = useCallback(() => {
		manager
			.fetchSyncBlockData(syncBlockNode)
			.then((data) => {
				if (data?.error) {
					// if there is an error, we don't want to replace real existing data with the error data
					setFetchSyncBlockDataResult((prev) => {
						if (!prev || prev.error) {
							return data;
						}
						return prev;
					});
				} else {
					setFetchSyncBlockDataResult(data ?? null);
				}
			})
			.catch(() => {
				//TODO: EDITOR-1921 - add error analytics
				setFetchSyncBlockDataResult((prev) => {
					if (!prev || prev.error) {
						return { error: SyncBlockError.Errored };
					}
					return prev;
				});
			});
	}, [manager, syncBlockNode]);

	useEffect(() => {
		fetchSyncBlockNode();
		const interval = window.setInterval(fetchSyncBlockNode, 3000);

		return () => {
			window.clearInterval(interval);
		};
	}, [fetchSyncBlockNode]);
	return fetchSyncBlockDataResult;
};
