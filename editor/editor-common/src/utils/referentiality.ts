import type { FragmentAttributes } from '@atlaskit/adf-schema/schema';
import type { Mark, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import type { ConfirmDialogChildInfo } from '../types';

type LocalId = FragmentAttributes['localId'];

type NodeAndTargetLinkages = {
	readonly localId: LocalId;
	readonly name: string;
	readonly node: PMNode;
	readonly pos: number;
	readonly targets: LocalId[];
};

export const isReferencedSource = (state: EditorState, node?: PMNode): boolean => {
	if (!node) {
		return false;
	}

	let found = false;

	// Handle nodes having 2 uuids. They could have a localId or a fragment. Regardless this needs
	// to check if either id is used by a data consumer.
	const localIds = new Set<string>(
		[
			node.attrs?.localId,
			node.marks?.find((mark) => mark.type === state.schema.marks.fragment)?.attrs?.localId,
		].filter(Boolean),
	);

	// If there are no uuids on the node then it's not possible for it to be referenced anywhere.
	if (!localIds.size) {
		return false;
	}

	state.doc.descendants((node) => {
		if (found) {
			return false;
		}

		const dataConsumer = node.marks.find((mark) => mark.type === state.schema.marks.dataConsumer);

		if (!dataConsumer) {
			return true;
		}

		found = dataConsumer.attrs.sources?.some((src: string) => localIds.has(src)) ?? false;

		return !found;
	});

	return found;
};

export const getConnections = (state: EditorState) => {
	const result: Record<LocalId, NodeAndTargetLinkages> = {};

	const { doc, schema } = state;

	// Keeps a map of all raw ids -> to their preferred normalised varient. A node with both fragmentMark & localId will
	// have both ids mapped here to the same normalized version.
	const normalizedIds = new Map<LocalId, LocalId>();
	const dataConsumerSources = new Map<LocalId, LocalId[]>();

	// Perform a prelim scan creating the initial id to connection link mappings.
	// This will also save a list of data sources consumed per node.
	doc.descendants((node, pos) => {
		let dataConsumer: Mark | undefined;
		let fragmentMark: Mark | undefined;

		node.marks.some((mark) => {
			if (mark.type === schema.marks.dataConsumer) {
				dataConsumer = mark;
			} else if (mark.type === schema.marks.fragment) {
				fragmentMark = mark;
			}

			// Stop searching marks if we've found both consumer and fragment.
			return !!dataConsumer && !!fragmentMark;
		});

		// If node cannot be referenced by any means then abort.
		if (!fragmentMark && !node.attrs?.localId) {
			return true;
		}

		const normalizedId: LocalId | undefined = fragmentMark?.attrs?.localId ?? node.attrs?.localId;

		if (!normalizedId) {
			return true;
		}

		if (!!fragmentMark?.attrs?.localId) {
			normalizedIds.set(fragmentMark.attrs.localId, normalizedId);
		}

		if (!!node.attrs?.localId) {
			normalizedIds.set(node.attrs.localId, normalizedId);
		}

		if (!!result[normalizedId]) {
			// Duplicate ID has been found, we'll care about the first one for now.
			return true;
		}

		result[normalizedId] = {
			localId: normalizedId,
			name: fragmentMark?.attrs?.name,
			node,
			pos,
			targets: [],
		};

		if (!!dataConsumer && dataConsumer.attrs.sources.length) {
			dataConsumerSources.set(normalizedId, dataConsumer.attrs.sources);
		}

		// Do not descend into children of a node which has a dataConsumer attached. This assumes all children of the node cannot
		// be referenced by another node.
		return !dataConsumer;
	});

	// This 2nd-pass only looks at the consumer sources and updates all connections with the correct id refs.
	for (const [localId, sources] of dataConsumerSources) {
		// This is a ref to the node (connection link) which contains the consumer.

		sources.forEach((src: string) => {
			const normalizedId = normalizedIds.get(src) ?? src;
			const srcLink = result[normalizedId];

			if (srcLink && normalizedId !== localId) {
				srcLink.targets.push(localId);
			}
		});
	}
	return result;
};

export const removeConnectedNodes = (state: EditorState, node?: PMNode) => {
	if (!node) {
		return state.tr;
	}

	const selectedLocalIds = getSelectedLocalIds(state, node);
	const allNodes = getConnections(state);
	const idsToBeDeleted = getIdsToBeDeleted(selectedLocalIds, allNodes);

	if (!idsToBeDeleted?.length) {
		return state.tr;
	}

	const { tr } = state;
	let newTr = tr;
	idsToBeDeleted.forEach((id) => {
		if (!allNodes[id]) {
			return;
		}
		const { node, pos } = allNodes[id];
		newTr = newTr.delete(newTr.mapping.map(pos), newTr.mapping.map(node.nodeSize + pos));
	});
	return newTr;
};

// find all ids need to be remove connected to selected extension
const getIdsToBeDeleted = (
	selectedIds: Set<string>,
	allNodes: Record<LocalId, NodeAndTargetLinkages>,
): string[] => {
	if (!selectedIds.size) {
		return [];
	}

	let searchSet = [...selectedIds];
	const deletedIds = new Set<string>();

	while (searchSet.length) {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const id = searchSet.pop()!;
		if (allNodes[id]) {
			deletedIds.add(allNodes[id].localId);
			searchSet = searchSet.concat(
				allNodes[id]?.targets.filter(
					(targetId: string) => !deletedIds.has(allNodes[targetId]?.localId),
				) ?? [],
			);
		}
	}

	return Array.from(deletedIds);
};

// for get children info for confirmation dialog
export const getChildrenInfo = (state: EditorState, node?: PMNode): ConfirmDialogChildInfo[] => {
	let allChildrenHadName = true;

	if (!node) {
		return [];
	}

	const childrenIdSet = new Set<string>();
	const childrenInfoArray: ConfirmDialogChildInfo[] = [];
	const allNodes = getConnections(state);

	const selectedNodeIds = getSelectedLocalIds(state, node);
	selectedNodeIds.forEach((id: string) => {
		if (allNodes[id]) {
			allNodes[id].targets.forEach(childrenIdSet.add, childrenIdSet);
		}
	});

	for (const id of childrenIdSet) {
		if (!getNodeNameById(id, allNodes)) {
			allChildrenHadName = false;
			break;
		} else {
			childrenInfoArray.push({
				id,
				name: getNodeNameById(id, allNodes),
				amount: getChildrenNodeAmount(id, allNodes),
			});
		}
	}
	return allChildrenHadName ? childrenInfoArray : [];
};

const getChildrenNodeAmount = (
	id: string,
	allNodes: Record<LocalId, NodeAndTargetLinkages>,
): number => {
	const searchTerms: Set<string> = new Set<string>([id]);
	const traverseHistory: Map<string, boolean> = new Map<string, boolean>();
	const childrenIds: Set<string> = new Set<string>();

	traverseHistory.set(id, false);

	while (searchTerms.size > 0) {
		const [currTerm] = searchTerms;
		const targets = getNodeTargetsById(currTerm, allNodes);

		targets.forEach((target: string) => {
			const isTargetCounted = traverseHistory.get(target);
			if (!isTargetCounted) {
				searchTerms.add(target);
				childrenIds.add(target);
			}
			target !== id && childrenIds.add(target);
		});
		traverseHistory.set(currTerm, true);
		searchTerms.delete(currTerm);
	}

	return childrenIds.size;
};

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getNodeTargetsById = (id: string | undefined, allNodes: any): string[] => {
	if (!id || !allNodes[id]) {
		return [];
	}
	return allNodes[id].targets;
};

const getNodeNameById = (
	id: string | Set<string>,
	allNodes: Record<LocalId, NodeAndTargetLinkages>,
): string | null => {
	if (typeof id === 'object') {
		let name: string | undefined;
		id.forEach((localId) => {
			name = name ?? allNodes[localId]?.name;
		});
		return name || null;
	}

	if (!id || !allNodes[id]) {
		return null;
	}

	return allNodes[id].name;
};

const getSelectedLocalIds = (state: EditorState, node?: PMNode): Set<string> => {
	if (!node) {
		return new Set<string>([]);
	}

	const localIds = new Set<string>(
		[
			node.attrs?.localId,
			node.marks?.find((mark) => mark.type === state.schema.marks.fragment)?.attrs?.localId,
		].filter(Boolean),
	);
	return localIds;
};

export const getNodeName = (state: EditorState, node?: PMNode): string => {
	return node?.marks?.find((mark) => mark.type === state.schema.marks.fragment)?.attrs?.name ?? '';
};
