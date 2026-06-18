import { BatchAttrsStep, OverrideDocumentStep } from '@atlaskit/adf-schema/steps';
import { tintDirtyTransaction } from '@atlaskit/editor-common/collab';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { stepHasSlice } from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { PluginKey, type Transaction } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { LocalIdPlugin } from '../localIdPluginType';

import { generateShortUUID, generatedShortUUIDs } from './generateShortUUID';

export const localIdPluginKey: PluginKey = new PluginKey('localIdPlugin');

const generateUUID = () => {
	return generateShortUUID();
};

// Fallback for Safari which doesn't support requestIdleCallback
const requestIdleCallbackWithFallback = (callback: () => void) => {
	if (typeof requestIdleCallback !== 'undefined') {
		requestIdleCallback(callback);
	} else {
		// Fallback to requestAnimationFrame for Safari
		requestAnimationFrame(callback);
	}
};

export const createPlugin = (api: ExtractInjectionAPI<LocalIdPlugin> | undefined): SafePlugin => {
	// Track if we've initialized existing UUIDs for this plugin instance
	let hasInitializedExistingUUIDs = false;

	return new SafePlugin({
		key: localIdPluginKey,
		view: (editorView) => {
			/**
			 * This performs a one-time scan of the document to add local IDs
			 * to nodes that don't have them. It's designed to run only once per
			 * editor instance to avoid performance issues.
			 */
			if (api?.collabEdit) {
				return {
					update: () => {},
				};
			}

			requestIdleCallbackWithFallback(() => {
				const tr = editorView.state.tr;
				const nodesToUpdate = new Map<number, string>(); // position -> localId

				const { text, hardBreak, mediaGroup } = editorView.state.schema.nodes;
				// Media group is ignored for now
				// https://bitbucket.org/atlassian/adf-schema/src/fb2236147a0c2bc9c8efbdb75fd8f8c411df44ba/packages/adf-schema/src/next-schema/nodes/mediaGroup.ts#lines-12
				const ignoredNodeTypes = mediaGroup
					? [text.name, hardBreak.name, mediaGroup.name]
					: [text.name, hardBreak.name];

				editorView.state.doc.descendants((node: PMNode, pos) => {
					if (
						!ignoredNodeTypes.includes(node.type.name) &&
						!node.attrs.localId &&
						!!node.type.spec.attrs?.localId
					) {
						nodesToUpdate.set(pos, generateUUID());
					}
					return true; // Continue traversing
				});

				if (nodesToUpdate.size > 0) {
					batchAddLocalIdToNodes(nodesToUpdate, tr);
					tintDirtyTransaction(tr);
					editorView.dispatch(tr);
				}
			});

			return {
				update: () => {},
			};
		},
		/**
		 * Handles adding local IDs to new nodes that are created and have the localId attribute
		 * This ensures uniqueness of localIds on nodes being created or edited
		 */
		appendTransaction: (transactions, _oldState, newState) => {
			if (api?.composition.sharedState.currentState()?.isComposing) {
				return undefined;
			}

			let modified = false;
			const tr = newState.tr;
			const { text, hardBreak, mediaGroup } = newState.schema.nodes;
			// Media group is ignored for now
			// https://bitbucket.org/atlassian/adf-schema/src/fb2236147a0c2bc9c8efbdb75fd8f8c411df44ba/packages/adf-schema/src/next-schema/nodes/mediaGroup.ts#lines-12
			const ignoredNodeTypes = [text?.name, hardBreak?.name, mediaGroup?.name];
			const addedNodes = new Set<PMNode>();
			// A single PMNode reference can appear at multiple positions in the doc (e.g.
			// `createTable` from `prosemirror-utils` reuses cell node objects across
			// non-header rows), so the new code path tracks every position per node identity.
			// The legacy path retains the single-position-per-node map for compatibility.
			const positionsByNode = new Map<PMNode, Set<number>>();
			const addedNodePos = new Map<PMNode, number>();
			const localIds = new Set<string>();
			const nodesToUpdate = new Map<number, string>(); // position -> localId

			// Process only the nodes added in the transactions
			transactions.forEach((transaction) => {
				if (!transaction.docChanged) {
					return;
				}

				if (expValEquals('platform_editor_ai_template_localids', 'isEnabled', true)) {
					if (
						transaction.getMeta('uiEvent') === 'cut' ||
						// We skip remote transactions as we don't want to affect transactions
						// created by other collaborators.
						//
						// Exception (platform_editor_ai_template_localids): applying a template to a
						// blank page arrives as a remote OverrideDocumentStep (a full-document
						// replacement with no localIds). We still want those template nodes to get
						// localIds, so we let such transactions through. Ordinary remote edits are
						// still skipped, and existing localIds are never overwritten.
						(Boolean(transaction.getMeta('isRemote')) &&
							!transaction.steps.some((step) => step instanceof OverrideDocumentStep))
					) {
						return;
					}
				} else {
					if (
						transaction.getMeta('uiEvent') === 'cut' ||
						// We skip remote transactions as we don't want to affect transactions created
						// by other users
						Boolean(transaction.getMeta('isRemote'))
					) {
						return;
					}
				}

				// Ignore local ID updates for certain transactions
				// this is purposely not a public API as we should not use
				// this except in some circumstances (ie. streaming)
				if (transaction.getMeta('ignoreLocalIdUpdate')) {
					return;
				}

				transaction.steps.forEach((step) => {
					// Steps with a slice are scanned for nodes that need localIds.
					// OverrideDocumentStep (template replacement) has no `slice`, so when the
					// experiment is on we also scan it so the inserted template nodes get
					// localIds.
					const isTemplateOverrideStep =
						step instanceof OverrideDocumentStep &&
						expValEquals('platform_editor_ai_template_localids', 'isEnabled', true);

					if (!stepHasSlice(step) && !isTemplateOverrideStep) {
						return;
					}
					step.getMap().forEach((oldStart, oldEnd, newStart, newEnd) => {
						// Scan the changed range to find all nodes
						tr.doc.nodesBetween(newStart, Math.min(newEnd, tr.doc.content.size), (node, pos) => {
							if (ignoredNodeTypes.includes(node.type.name) || !node.type.spec.attrs?.localId) {
								return true;
							}

							modified = true;

							if (fg('platform_editor_use_localid_dedupe')) {
								// Always add to addedNodes for duplicate prevention
								addedNodes.add(node);
								if (expValEquals('platform_editor_ai_tablecell_localids', 'isEnabled', true)) {
									const positions = positionsByNode.get(node) ?? new Set<number>();
									positions.add(pos);
									positionsByNode.set(node, positions);
								} else {
									addedNodePos.set(node, pos);
								}
							} else {
								if (!node?.attrs.localId) {
									nodesToUpdate.set(pos, generateUUID());
								}
							}

							return true;
						});
					});
				});
			});

			if (addedNodes.size > 0 && fg('platform_editor_use_localid_dedupe')) {
				newState.doc.descendants((node) => {
					// Also track existing UUIDs in the global Set for short UUID collision detection
					if (node.attrs?.localId && !hasInitializedExistingUUIDs) {
						generatedShortUUIDs.add(node.attrs.localId);
					}

					if (addedNodes.has(node)) {
						return true;
					}

					localIds.add(node.attrs.localId);
					return true;
				});
				hasInitializedExistingUUIDs = true;
				// Also ensure the added have no duplicates
				const seenIds = new Set<string>();

				if (expValEquals('platform_editor_ai_tablecell_localids', 'isEnabled', true)) {
					for (const node of addedNodes) {
						const positions = positionsByNode.get(node);
						if (!positions || positions.size === 0) {
							continue;
						}

						const existingId = node.attrs.localId;
						const needsNewIds = !existingId || localIds.has(existingId) || seenIds.has(existingId);

						if (needsNewIds) {
							// No usable localId: assign a fresh unique one to every position.
							for (const pos of positions) {
								const newId = generateUUID();
								nodesToUpdate.set(pos, newId);
								seenIds.add(newId);
								modified = true;
							}
						} else if (positions.size > 1) {
							// Shared node reference: keep the existing id at the first position,
							// assign fresh ones to the rest so they don't share the same localId.
							seenIds.add(existingId);
							const [_first, ...rest] = Array.from(positions);
							for (const pos of rest) {
								const newId = generateUUID();
								nodesToUpdate.set(pos, newId);
								seenIds.add(newId);
								modified = true;
							}
						} else if (existingId) {
							seenIds.add(existingId);
						}
					}
				} else {
					for (const node of addedNodes) {
						if (
							!node.attrs.localId ||
							localIds.has(node.attrs.localId) ||
							seenIds.has(node.attrs.localId)
						) {
							const pos = addedNodePos.get(node);
							if (pos !== undefined) {
								const newId = generateUUID();
								nodesToUpdate.set(pos, newId);
								seenIds.add(newId);
								modified = true;
							}
						}
						if (node.attrs.localId) {
							seenIds.add(node.attrs.localId);
						}
					}
				}
			}
			// Apply local ID updates based on the improvements feature flag:
			// - When enabled: Batch all updates into a single BatchAttrsStep
			// - When disabled: Individual steps were already applied above during node processing
			if (modified && nodesToUpdate.size > 0) {
				batchAddLocalIdToNodes(nodesToUpdate, tr);
			}

			return modified ? tr : undefined;
		},
	});
};
/**
 * Batch adds local IDs to nodes using a BatchAttrsStep
 * @param nodesToUpdate Map of position -> localId for nodes that need updates
 * @param tr
 */
export const batchAddLocalIdToNodes = (
	nodesToUpdate: Map<number, string>,
	tr: Transaction,
): void => {
	const batchData = Array.from(nodesToUpdate.entries()).map(([pos, localId]) => {
		const node = tr.doc.nodeAt(pos);
		if (!node) {
			throw new Error(`Node does not exist at position ${pos}`);
		}
		return {
			position: pos,
			attrs: { localId },
			nodeType: node.type.name,
		};
	});

	tr.step(new BatchAttrsStep(batchData));
	tr.setMeta('addToHistory', false);
};
