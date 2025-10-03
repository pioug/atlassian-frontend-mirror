import { useEffect, useState, useMemo } from 'react';

import type { DocNode } from '@atlaskit/adf-schema';
import type { JSONNode } from '@atlaskit/editor-json-transformer/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { convertSyncBlockPMNodeToSyncBlockData } from '../utils/utils';

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
	isNodeSupported = (node: JSONNode): node is SyncBlockNode => node.type === 'syncBlock';
	nodeDataKey = (node: SyncBlockNode) => node.attrs.localId;
	fetchNodesData = (nodes: SyncBlockNode[]): Promise<SyncBlockData[]> => {
		return Promise.all(
			nodes.map((node) => {
				return this.fetchProvider.fetchData(node.attrs.resourceId);
			}),
		);
	};

	/**
	 *
	 * @param nodes
	 * @param data
	 *
	 * @returns the resource ids of the nodes that were written
	 */
	writeNodesData = (
		nodes: SyncBlockNode[],
		data: SyncBlockData[],
	): Promise<Array<string | undefined>> => {
		const resourceIds: Promise<string>[] = [];
		nodes.forEach((node, index) => {
			if (!data[index].content) {
				resourceIds.push(Promise.reject('No Synced Blockcontent to write'));
				return;
			}
			const resourceId = this.writeProvider.writeData(data[index]);
			resourceIds.push(resourceId);
		});
		return Promise.all(resourceIds);
	};

	getSourceId = () => {
		return this.sourceId;
	};
}

export const useFetchDocNode = (
	editorView: EditorView,
	node: PMNode,
	defaultDocNode: DocNode,
	provider?: SyncBlockDataProvider,
): DocNode => {
	const [docNode, setDocNode] = useState<DocNode>(defaultDocNode);

	const fetchNode = (editorView: EditorView, node: PMNode, provider: SyncBlockDataProvider) => {
		const nodes: SyncBlockNode[] = [convertSyncBlockPMNodeToSyncBlockData(node, false)];
		provider?.fetchNodesData(nodes).then((data) => {
			if (data && data[0]?.content) {
				const newNode = editorView.state.schema.nodeFromJSON(data[0].content);
				setDocNode({ ...newNode.toJSON(), version: 1 });
			}
		});
	};

	useEffect(() => {
		if (!provider) {
			return;
		}
		fetchNode(editorView, node, provider);
		const interval = window.setInterval(() => {
			fetchNode(editorView, node, provider);
		}, 3000);

		return () => {
			window.clearInterval(interval);
		};
	}, [editorView, node, provider]);
	return docNode;
};

export const useMemoizedSyncedBlockProvider = (
	fetchProvider: ADFFetchProvider,
	writeProvider: ADFWriteProvider,
	sourceId: string,
) => {
	return useMemo(() => {
		return new SyncBlockProvider(fetchProvider, writeProvider, sourceId);
	}, [fetchProvider, writeProvider, sourceId]);
};

export const useHandleContentChanges = (
	updatedDoc: PMNode,
	isSource: boolean,
	node: PMNode,
	provider?: SyncBlockDataProvider,
): void => {
	useEffect(() => {
		if (!isSource) {
			return;
		}
		if (!provider) {
			return;
		}
		const syncBlockNode = convertSyncBlockPMNodeToSyncBlockData(node, false);
		const data: SyncBlockData = {
			content: updatedDoc.toJSON(),
			resourceId: node.attrs.resourceId,
			localId: node.attrs.localId,
		};
		provider?.writeNodesData([syncBlockNode], [data]);
	}, [isSource, node, provider, updatedDoc]);
};
