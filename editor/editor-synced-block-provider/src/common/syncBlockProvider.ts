import { useMemo } from 'react';

import type { JSONNode } from '@atlaskit/editor-json-transformer/types';

import { getLocalIdFromAri, getPageARIFromResourceId } from '../utils/ari';

import {
	SyncBlockDataProvider,
	type ADFFetchProvider,
	type ADFWriteProvider,
	type SyncBlockData,
	type SyncBlockNode,
} from './types';

export class SyncBlockProvider extends SyncBlockDataProvider {
	name = 'syncBlockProvider';
	private fetchProvider: ADFFetchProvider;
	private writeProvider: ADFWriteProvider;
	private sourceId: string;

	constructor(fetchProvider: ADFFetchProvider, writeProvider: ADFWriteProvider, sourceId: string) {
		super();
		this.fetchProvider = fetchProvider;
		this.writeProvider = writeProvider;
		this.sourceId = sourceId;
	}
	isNodeSupported(node: JSONNode): node is SyncBlockNode {
		return node.type === 'syncBlock';
	}
	nodeDataKey(node: SyncBlockNode) {
		return node.attrs.localId;
	}
	fetchNodesData(nodes: SyncBlockNode[]): Promise<SyncBlockData[]> {
		return Promise.all(
			nodes.map((node) => {
				return this.fetchProvider.fetchData(node.attrs.resourceId);
			}),
		);
	}

	/**
	 *
	 * @param nodes
	 * @param data
	 *
	 * @returns the resource ids of the nodes that were written
	 */
	writeNodesData(
		nodes: SyncBlockNode[],
		data: SyncBlockData[],
	): Promise<Array<string | undefined>> {
		const resourceIds: Promise<string>[] = [];
		nodes.forEach((_node, index) => {
			if (!data[index].content) {
				resourceIds.push(Promise.reject('No Synced Block content to write'));
				return;
			}
			const resourceId = this.writeProvider.writeData(data[index]);
			resourceIds.push(resourceId);
		});
		return Promise.all(resourceIds);
	}

	getSourceId() {
		return this.sourceId;
	}

	retrieveSyncBlockSourceUrl(node: SyncBlockNode): Promise<string | undefined> {
		const { resourceId } = node.attrs;
		let pageARI;
		let sourceLocalId;
		if (resourceId && typeof resourceId === 'string') {
			try {
				pageARI = getPageARIFromResourceId(resourceId);
			} catch (error) {
				return Promise.reject(error);
			}

			try {
				sourceLocalId = getLocalIdFromAri(resourceId);
			} catch (error) {
				// EDITOR-1921: log analytic here, safe to continue
			}
		}

		return pageARI ? fetchURLfromARI(pageARI, sourceLocalId) : Promise.resolve(undefined);
	}
}

export const useMemoizedSyncedBlockProvider = (
	fetchProvider: ADFFetchProvider,
	writeProvider: ADFWriteProvider,
	sourceId: string,
) => {
	return useMemo(() => {
		return new SyncBlockProvider(fetchProvider, writeProvider, sourceId);
	}, [fetchProvider, writeProvider, sourceId]);
};

const fetchURLfromARI = async (
	ari: string,
	sourceLocalId?: string,
): Promise<string | undefined> => {
	const response = await fetch('/gateway/api/object-resolver/resolve/ari', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({ ari }),
	});

	if (response.ok) {
		const payload = await response.json();
		const url = payload?.data?.url;
		if (typeof url === 'string') {
			return sourceLocalId ? url + `?block=${sourceLocalId}` : url;
		}
	} else {
		//eslint-disable-next-line no-console
		console.error('Failed to fetch URL from ARI', response.statusText);
	}

	return undefined;
};
