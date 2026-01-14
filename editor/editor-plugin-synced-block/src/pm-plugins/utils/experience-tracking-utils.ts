import { pmHistoryPluginKey } from '@atlaskit/editor-common/utils';
import type { EditorState, Transaction } from "@atlaskit/editor-prosemirror/state";
import { findChildren } from '@atlaskit/editor-prosemirror/utils';

let targetEl: HTMLElement | undefined;

export const getTarget = (containerElement: HTMLElement | undefined): HTMLElement | null => {
	if (!targetEl) {
		const element = containerElement?.querySelector('.ProseMirror');

		if (!element || !(element instanceof HTMLElement)) {
			return null;
		}

		targetEl = element;
	}

	return targetEl;
};

export const wasSyncBlockDeletedOrAddedByHistory = (tr: Transaction, oldState: EditorState, newState: EditorState): { hasAddedSyncBlock?: boolean; hasDeletedSyncBlock?: boolean, isUndo?: boolean } => {
	const historyMeta = tr.getMeta(pmHistoryPluginKey);
	if (!Boolean(historyMeta)) {
		return {};
	}

	const { syncBlock } = newState.schema.nodes;

	const oldSyncBlockNodes = findChildren(oldState.doc, (node) => node.type === syncBlock);
	const newSyncBlockNodes = findChildren(newState.doc, (node) => node.type === syncBlock);

	const oldSyncBlockIds = new Set<string>(
		oldSyncBlockNodes
			.map((nodeWithPos) => nodeWithPos.node.attrs.localId)
			.filter((localId): localId is string => Boolean(localId))
	);

	const newSyncBlockIds = new Set<string>(
		newSyncBlockNodes
			.map((nodeWithPos) => nodeWithPos.node.attrs.localId)
			.filter((localId): localId is string => Boolean(localId))
	);

	const hasDeletedSyncBlock = Array.from(oldSyncBlockIds).some((localId) => !newSyncBlockIds.has(localId));
	const hasAddedSyncBlock = Array.from(newSyncBlockIds).some((localId) => !oldSyncBlockIds.has(localId));

	return { hasDeletedSyncBlock, hasAddedSyncBlock, isUndo: historyMeta.redo === false };
};

const getResourceIds = (nodes: NodeList, resourceIds: string[], query: string) => {
	nodes.forEach((node) => {
		if (!(node instanceof HTMLElement)) {
			return;
		}

		const syncBlockElements = node.querySelectorAll(query);
		syncBlockElements.forEach((element) => {
			const resourceId = element.getAttribute('resourceid');
			if (resourceId) {
				resourceIds.push(resourceId);
			}
		});
	});
}

export const getAddedResourceIds = (mutations: MutationRecord[], query: string): string[] => {
	const resourceIds: string[] = [];

	mutations.forEach((mutation) => {
		if (mutation.type === 'childList') {
			getResourceIds(mutation.addedNodes, resourceIds, query);
		}
	});

	return resourceIds;
};

export const getRemovedResourceIds = (mutations: MutationRecord[], query: string): string[] => {
	const resourceIds: string[] = [];

	mutations.forEach((mutation) => {
		if (mutation.type === 'childList') {
			getResourceIds(mutation.removedNodes, resourceIds, query);
		}
	});

	return resourceIds;
};
