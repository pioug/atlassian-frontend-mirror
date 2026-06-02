import { getInsertedCodeBlocksInTransaction } from '@atlaskit/editor-common/code-block';
import type { Node as PMNode, NodeType as PMNodeType } from '@atlaskit/editor-prosemirror/model';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';

import type { AutoDetectEntry, AutoDetectState } from '../pm-plugins/auto-detect-state';
import { getAllChangedCodeBlocksInTransaction } from '../pm-plugins/utils';

const MIN_AUTO_DETECT_TEXT_LENGTH = 20;

export const shouldTriggerLargeChangeDetection = (
	lastObservedText: string,
	text: string,
): boolean => {
	if (!lastObservedText) {
		return text.length > 0;
	}

	return Math.abs(text.length - lastObservedText.length) > lastObservedText.length / 2;
};

export const getFirstLine = (text: string): string => text.split('\n')[0] ?? '';

export const hasEnoughTextForAutoDetection = (text: string): boolean =>
	text.trim().length >= MIN_AUTO_DETECT_TEXT_LENGTH;

export const getLocalId = (node: PMNode): string | null =>
	typeof node.attrs.localId === 'string' ? node.attrs.localId : null;

export const createAutoDetectEntry = (
	node: PMNode,
	pos: number,
	isPending: boolean,
	previous?: AutoDetectEntry,
): AutoDetectEntry => ({
	lastObservedText: node.textContent,
	lastObservedFirstLine: getFirstLine(node.textContent),
	isPending,
	detectionResult: previous?.detectionResult,
	autoDetectedLanguage: previous?.autoDetectedLanguage,
	pos,
});

export const queueAutoDetection = (
	languageDetectionMap: AutoDetectState['languageDetectionMap'],
	node: PMNode,
	pos: number,
	isPending: boolean,
): AutoDetectState['languageDetectionMap'] => {
	const localId = getLocalId(node);

	if (!localId) {
		return languageDetectionMap;
	}

	return {
		...languageDetectionMap,
		[localId]: createAutoDetectEntry(node, pos, isPending, languageDetectionMap[localId]),
	};
};

export const removeAutoDetection = (
	languageDetectionMap: AutoDetectState['languageDetectionMap'],
	localId: string,
): AutoDetectState['languageDetectionMap'] => {
	if (!languageDetectionMap[localId]) {
		return languageDetectionMap;
	}

	const nextLanguageDetectionMap = { ...languageDetectionMap };
	delete nextLanguageDetectionMap[localId];
	return nextLanguageDetectionMap;
};

const getCodeBlockLocalIdsRemovedFromChangedRanges = (
	tr: ReadonlyTransaction,
	codeBlockType: PMNodeType,
): Set<string> => {
	const localIds = new Set<string>();

	tr.steps.forEach((step, stepIndex) => {
		const docAtStep = tr.docs[stepIndex];

		step.getMap().forEach((oldStart, oldEnd) => {
			if (oldStart === oldEnd) {
				return;
			}

			const clampedOldEnd = Math.min(oldEnd, docAtStep.content.size);
			docAtStep.nodesBetween(oldStart, clampedOldEnd, (node, pos) => {
				if (node.type !== codeBlockType) {
					return true;
				}

				const isWholeCodeBlockRemoved = pos >= oldStart && pos + node.nodeSize <= clampedOldEnd;
				if (!isWholeCodeBlockRemoved) {
					return false;
				}

				const localId = getLocalId(node);
				if (localId) {
					localIds.add(localId);
				}

				return false;
			});
		});
	});

	return localIds;
};

type InsertedCodeBlock = {
	localId: string;
	node: PMNode;
	pos: number;
};

type CodeBlockTransactionChanges = {
	deletedLocalIds: Set<string>;
	insertedCodeBlocks: InsertedCodeBlock[];
};

const getCodeBlockTransactionChanges = (
	tr: ReadonlyTransaction,
	codeBlockType: PMNodeType,
): CodeBlockTransactionChanges => {
	const insertedNodesWithPos = getInsertedCodeBlocksInTransaction(tr, codeBlockType);
	const removedFromChangedRangesLocalIds = getCodeBlockLocalIdsRemovedFromChangedRanges(
		tr,
		codeBlockType,
	);
	const insertedLocalIds = new Set<string>();
	const insertedCodeBlocks: InsertedCodeBlock[] = [];

	insertedNodesWithPos.forEach(({ node, pos }) => {
		const localId = getLocalId(node);
		if (!localId) {
			return;
		}

		insertedLocalIds.add(localId);

		if (!removedFromChangedRangesLocalIds.has(localId)) {
			insertedCodeBlocks.push({ localId, node, pos });
		}
	});

	const deletedLocalIds = new Set<string>();
	removedFromChangedRangesLocalIds.forEach((localId) => {
		if (!insertedLocalIds.has(localId)) {
			deletedLocalIds.add(localId);
		}
	});

	return {
		deletedLocalIds,
		insertedCodeBlocks,
	};
};

export const updateAutoDetectState = (
	tr: ReadonlyTransaction,
	pluginState: AutoDetectState,
): AutoDetectState['languageDetectionMap'] => {
	const { codeBlock } = tr.doc.type.schema.nodes;
	const isPaste = tr.getMeta('paste') === true || tr.getMeta('uiEvent') === 'paste';
	const isExternalContentChange =
		tr.getMeta('replaceDocument') === true || tr.getMeta('isRemote') === true;
	const hasTrackedEntries = Object.keys(pluginState.languageDetectionMap).length > 0;

	// Page loads and remote edits should not start auto-detection for code blocks.
	if (!hasTrackedEntries && isExternalContentChange) {
		return pluginState.languageDetectionMap;
	}

	// Existing entries still need mapping/deletion cleanup, but external edits should not refresh text.
	const changedCodeBlockNodes = isExternalContentChange
		? []
		: getAllChangedCodeBlocksInTransaction(tr);
	if (!hasTrackedEntries && !changedCodeBlockNodes.length) {
		return pluginState.languageDetectionMap;
	}

	const { deletedLocalIds, insertedCodeBlocks } = getCodeBlockTransactionChanges(tr, codeBlock);

	let languageDetectionMap: AutoDetectState['languageDetectionMap'] = hasTrackedEntries
		? Object.fromEntries(
				Object.entries(pluginState.languageDetectionMap).map(([localId, entry]) => [
					localId,
					{ ...entry, pos: tr.mapping.map(entry.pos) },
				]),
			)
		: pluginState.languageDetectionMap;

	if (!isExternalContentChange) {
		insertedCodeBlocks.forEach(({ localId, node, pos }) => {
			if (node.attrs.language) {
				languageDetectionMap = removeAutoDetection(languageDetectionMap, localId);
				return;
			}

			languageDetectionMap = queueAutoDetection(
				languageDetectionMap,
				node,
				pos,
				hasEnoughTextForAutoDetection(node.textContent),
			);
		});

		changedCodeBlockNodes.forEach(({ node, pos }) => {
			const localId = getLocalId(node);
			if (!localId || !languageDetectionMap[localId]) {
				return;
			}

			const currentLanguage = node.attrs.language;
			const previousEntry = languageDetectionMap[localId];
			if (currentLanguage && currentLanguage !== previousEntry.autoDetectedLanguage) {
				languageDetectionMap = removeAutoDetection(languageDetectionMap, localId);
				return;
			}

			const text = node.textContent;
			const firstLine = getFirstLine(text);
			const shouldTriggerDetection =
				previousEntry.isPending ||
				isPaste ||
				firstLine !== previousEntry.lastObservedFirstLine ||
				shouldTriggerLargeChangeDetection(previousEntry.lastObservedText, text);
			const isPending = hasEnoughTextForAutoDetection(text) && shouldTriggerDetection;

			// Only pending detection refreshes the text snapshot; otherwise gradual typing
			// should continue comparing against the last attempted detection.
			languageDetectionMap = isPending
				? queueAutoDetection(languageDetectionMap, node, pos, true)
				: {
						...languageDetectionMap,
						[localId]: {
							...previousEntry,
							isPending: false,
							pos,
						},
					};
		});
	}

	deletedLocalIds.forEach((localId) => {
		if (languageDetectionMap[localId]) {
			languageDetectionMap = removeAutoDetection(languageDetectionMap, localId);
		}
	});

	return languageDetectionMap;
};
