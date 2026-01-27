import { BatchAttrsStep, SetAttrsStep } from '@atlaskit/adf-schema/steps';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Mark, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import {
	PluginKey,
	type EditorState,
	type ReadonlyTransaction,
} from '@atlaskit/editor-prosemirror/state';
import {
	AttrStep,
	DocAttrStep,
	ReplaceAroundStep,
	ReplaceStep,
	type Step,
} from '@atlaskit/editor-prosemirror/transform';

import type { LocalIdPlugin, LocalIdStatusCode } from '../localIdPluginType';

/**
 * This is a safeguard limit to avoid tracking localIds in extremely large documents with too many localIds.
 * If the number of unique localIds exceeds this limit, the watchmen plugin will disable itself to avoid performance issues.
 * Reminder: The Map has a hard limit of 2^24 (16 million) entries in V8, please keep this value well below that
 * to avoid any potential memory issues.
 */
const MAX_LOCAL_ID_MAP_SIZE = 2097152; // 2^21

/**
 * Plugin state tracking all localIds in the document
 */
export type LocalIdWatchmenState = {
	/**
	 * This flag controls whether or not the watchmen plugin will process transactions. Caution! disabling and then re-enabling
	 * this plugin will cause the watchment to rescan the whole document to sync the localId state.
	 */
	enabled: boolean;

	/**
	 * This is the initial count of localIds when the plugin was first initialized.
	 */
	initLocalIdSize: number;

	/**
	 * Timestamp of last state update for debugging
	 */
	lastUpdated: number;

	/**
	 * This is a list of all localIds which have ever existed in the document and whether or not they're currently
	 * on the page (ie "active") or not.
	 */
	localIdStatus: Map<string, LocalIdStatusCode>;
};

export const localIdWatchmenPluginKey = new PluginKey<LocalIdWatchmenState>(
	'localIdWatchmenPlugin',
);

/**
 * Scans the entire document to find all active localIds
 */
const scanDocumentForLocalIds = (doc: PMNode): Set<string> => {
	const localIds = new Set<string>();

	doc.descendants((node: PMNode) => {
		if (node.attrs?.localId) {
			localIds.add(node.attrs.localId);
		}

		// Check marks for localIds
		if (node.marks) {
			node.marks.forEach((mark: Mark) => {
				if (mark.attrs?.localId) {
					localIds.add(mark.attrs.localId);
				}
			});
		}

		return localIds.size < MAX_LOCAL_ID_MAP_SIZE; // Continue traversing
	});

	return localIds;
};

const getReplacementStatusCode = (tr: ReadonlyTransaction, step: Step): LocalIdStatusCode => {
	let method: string;
	if (step instanceof AttrStep || step instanceof DocAttrStep) {
		method = 'ByAttr';
	} else if (step instanceof SetAttrsStep) {
		method = 'BySetAttrs';
	} else if (step instanceof BatchAttrsStep) {
		method = 'ByBatchAttrs';
	} else if (step instanceof ReplaceStep) {
		const isDeleting = step.from < step.to; // range has content to remove
		const isInserting = step.slice.content.size > 0; // slice has content to insert
		if (isDeleting && !isInserting) {
			method = 'ByDelete'; // removing content, inserting nothing
			//} else if (!isDeleting && isInserting) {
			//method = 'ByInsert'; // This situation cannot be tracked since this would be part of the "current" status
		} else {
			// isDeleting && isInserting
			method = 'ByReplace';
		}
	} else if (step instanceof ReplaceAroundStep) {
		method = 'ByReplaceAround';
	} else {
		method = 'ByUnknown';
	}

	if (tr.getMeta('isAIStreamingTransformation')) {
		return `AIChange${method}` as LocalIdStatusCode;
	}

	if (tr.getMeta('replaceDocument')) {
		return `docChange${method}` as LocalIdStatusCode;
	}

	if (tr.getMeta('isRemote')) {
		return `remoteChange${method}` as LocalIdStatusCode;
	}

	return `localChange${method}` as LocalIdStatusCode;
};

/**
 * Handles AttrStep and DocAttrStep which modify a single attribute
 */
const handleAttrStep = (
	tr: ReadonlyTransaction,
	step: AttrStep | DocAttrStep,
	localIdStatus: LocalIdWatchmenState['localIdStatus'],
	preDoc: PMNode,
): { localIdStatus: LocalIdWatchmenState['localIdStatus']; modified: boolean } => {
	if (step.attr !== 'localId') {
		return { localIdStatus, modified: false };
	}

	let modified = false;
	const newlocalIdStatus = new Map(localIdStatus);

	// Get the old value if it exists
	let oldLocalId: string | undefined;
	if (step instanceof AttrStep) {
		try {
			const node = preDoc.nodeAt(step.pos);
			oldLocalId = node?.attrs?.localId;
		} catch {
			// Position might be invalid
		}
	}

	// Handle the new value
	const newLocalId = step.value as string | null;

	if (oldLocalId && oldLocalId !== newLocalId) {
		// Old localId is being replaced or removed
		newlocalIdStatus.set(oldLocalId, getReplacementStatusCode(tr, step));
		modified = true;
	}

	if (newLocalId) {
		newlocalIdStatus.set(newLocalId, 'current');
		modified = true;
	}

	return { localIdStatus: newlocalIdStatus, modified };
};

/**
 * Handles SetAttrsStep which sets multiple attributes at once
 */
const handleSetAttrsStep = (
	tr: ReadonlyTransaction,
	step: SetAttrsStep,
	localIdStatus: LocalIdWatchmenState['localIdStatus'],
	preDoc: PMNode,
): { localIdStatus: LocalIdWatchmenState['localIdStatus']; modified: boolean } => {
	const attrs = step.attrs as Record<string, unknown>;
	if (!attrs || !attrs.hasOwnProperty('localId')) {
		return { localIdStatus, modified: false };
	}

	let modified = false;
	const newlocalIdStatus = new Map(localIdStatus);

	// Get old localId from the node being modified
	try {
		const node = preDoc.nodeAt(step.pos);
		const oldLocalId = node?.attrs?.localId;

		if (oldLocalId && oldLocalId !== attrs.localId) {
			newlocalIdStatus.set(oldLocalId, getReplacementStatusCode(tr, step));
			modified = true;
		}
	} catch {
		// Position might be invalid
	}

	const newLocalId = attrs.localId as string | undefined;
	if (newLocalId) {
		newlocalIdStatus.set(newLocalId, 'current');
		modified = true;
	}

	return { localIdStatus: newlocalIdStatus, modified };
};

/**
 * Handles BatchAttrsStep which applies multiple attribute changes
 */
const handleBatchAttrsStep = (
	tr: ReadonlyTransaction,
	step: BatchAttrsStep,
	localIdStatus: LocalIdWatchmenState['localIdStatus'],
	preDoc: PMNode,
): { localIdStatus: LocalIdWatchmenState['localIdStatus']; modified: boolean } => {
	let modified = false;
	const newlocalIdStatus = new Map(localIdStatus);

	step.data.forEach((change) => {
		if (!change.attrs?.hasOwnProperty('localId')) {
			return;
		}

		// Get old localId from the node being modified
		try {
			const node = preDoc.nodeAt(change.position);
			const oldLocalId = node?.attrs?.localId;
			const newLocalId = change.attrs.localId as string | undefined;

			if (oldLocalId && oldLocalId !== newLocalId) {
				newlocalIdStatus.set(oldLocalId, getReplacementStatusCode(tr, step));
				modified = true;
			}

			if (newLocalId) {
				newlocalIdStatus.set(newLocalId, 'current');
				modified = true;
			}
		} catch {
			// Position might be invalid
		}
	});

	return { localIdStatus: newlocalIdStatus, modified };
};

/**
 * Handles ReplaceStep which inserts or deletes content
 */
const handleReplaceStep = (
	tr: ReadonlyTransaction,
	step: ReplaceStep,
	localIdStatus: LocalIdWatchmenState['localIdStatus'],
	preDoc: PMNode,
	postDoc: PMNode,
): { localIdStatus: LocalIdWatchmenState['localIdStatus']; modified: boolean } => {
	let modified = false;

	try {
		// Create a temporary set to collect new localIds
		const changedLocaleIds = new Map<string, LocalIdStatusCode>();
		const replaceCode = getReplacementStatusCode(tr, step);

		step.getMap().forEach((oldStart, oldEnd, newStart, newEnd) => {
			// For each step map item we can just look at the nodes in the old doc and mark them as "inactive" and then
			// look at the nodes in the doc after the step has been applied and mark them as "active"
			// then lastly we can compare these to the current states and only update what's different.
			preDoc.nodesBetween(oldStart, oldEnd, (node: PMNode) => {
				if (node.attrs?.localId) {
					changedLocaleIds.set(node.attrs.localId, replaceCode);
				}
				if (node.marks) {
					node.marks.forEach((mark: Mark) => {
						if (mark.attrs?.localId) {
							changedLocaleIds.set(node.attrs.localId, replaceCode);
						}
					});
				}
			});

			postDoc.nodesBetween(newStart, newEnd, (node: PMNode) => {
				if (node.attrs?.localId) {
					changedLocaleIds.set(node.attrs.localId, 'current');
				}

				if (node.marks) {
					node.marks.forEach((mark: Mark) => {
						if (mark.attrs?.localId) {
							changedLocaleIds.set(node.attrs.localId, 'current');
						}
					});
				}
			});
		});

		if (!!changedLocaleIds.size) {
			const newlocalIdStatus = new Map(localIdStatus);
			for (const [key, value] of changedLocaleIds) {
				if (!localIdStatus.has(key) || localIdStatus.get(key) !== value) {
					modified = true;
					newlocalIdStatus.set(key, value);
				}
			}

			return { localIdStatus: newlocalIdStatus, modified };
		}
	} catch {
		// If position calculation fails, do a full document rescan as fallback
		// This shouldn't happen often but provides safety
	}

	return { localIdStatus, modified };
};

/**
 * Handles ReplaceAroundStep which wraps or unwraps content
 */
const handleReplaceAroundStep = (
	tr: ReadonlyTransaction,
	step: ReplaceAroundStep,
	localIdStatus: LocalIdWatchmenState['localIdStatus'],
	preDoc: PMNode,
	postDoc: PMNode,
): { localIdStatus: LocalIdWatchmenState['localIdStatus']; modified: boolean } => {
	let modified = false;
	const newlocalIdStatus = new Map(localIdStatus);

	// Scan the affected region before and after the step
	const from = step.from;
	const to = step.to;

	try {
		// Collect localIds from the old region
		const oldLocalIds = new Set<string>();
		if (from < to && from >= 0 && to <= preDoc.content.size) {
			preDoc.nodesBetween(from, to, (node: PMNode) => {
				if (node.attrs?.localId) {
					oldLocalIds.add(node.attrs.localId);
				}
				if (node.marks) {
					node.marks.forEach((mark: Mark) => {
						if (mark.attrs?.localId) {
							oldLocalIds.add(mark.attrs.localId);
						}
					});
				}
			});
		}

		// Collect localIds from the new region
		const map = step.getMap();
		const newFrom = map.map(from, -1);
		const newTo = map.map(to, 1);
		const newLocalIds = new Set<string>();

		if (newFrom < newTo && newFrom >= 0 && newTo <= postDoc.content.size) {
			postDoc.nodesBetween(newFrom, newTo, (node: PMNode) => {
				if (node.attrs?.localId) {
					newLocalIds.add(node.attrs.localId);
				}
				if (node.marks) {
					node.marks.forEach((mark: Mark) => {
						if (mark.attrs?.localId) {
							newLocalIds.add(mark.attrs.localId);
						}
					});
				}
			});
		}

		// Find localIds that were removed
		oldLocalIds.forEach((localId) => {
			if (!newLocalIds.has(localId) && newlocalIdStatus.get(localId) === 'current') {
				newlocalIdStatus.set(localId, getReplacementStatusCode(tr, step));
				modified = true;
			}
		});

		// Find localIds that were added
		newLocalIds.forEach((localId) => {
			if (!oldLocalIds.has(localId)) {
				newlocalIdStatus.set(localId, 'current');
				modified = true;
			}
		});
	} catch {
		// Position might be invalid, skip this step
	}

	return { localIdStatus: newlocalIdStatus, modified };
};

/**
 * Processes a transaction to update localId tracking state
 */
const processTransaction = (
	tr: ReadonlyTransaction,
	currentState: LocalIdWatchmenState,
): LocalIdWatchmenState => {
	let localIdStatus = currentState.localIdStatus;
	let modified = false;

	// Process each step in the transaction
	try {
		tr.steps.forEach((step: Step, index: number) => {
			let result: {
				localIdStatus: LocalIdWatchmenState['localIdStatus'];
				modified: boolean;
			};
			// steps are relative to their docs, so we ensure we reference the doc before/after the step was applied.
			const preDoc = tr.docs?.[index] ?? tr.doc;
			const postDoc = tr.docs?.[index + 1] ?? tr.doc;

			if (step instanceof AttrStep || step instanceof DocAttrStep) {
				result = handleAttrStep(tr, step, localIdStatus, preDoc);
			} else if (step instanceof SetAttrsStep) {
				result = handleSetAttrsStep(tr, step, localIdStatus, preDoc);
			} else if (step instanceof BatchAttrsStep) {
				result = handleBatchAttrsStep(tr, step, localIdStatus, preDoc);
			} else if (step instanceof ReplaceStep) {
				result = handleReplaceStep(tr, step, localIdStatus, preDoc, postDoc);
			} else if (step instanceof ReplaceAroundStep) {
				result = handleReplaceAroundStep(tr, step, localIdStatus, preDoc, postDoc);
			} else {
				// Unknown step type, no changes
				result = { localIdStatus, modified: false };
			}

			localIdStatus = result.localIdStatus;
			modified = modified || result.modified;
		});
	} catch {
		// If any error occurs during step processing, we fallback to disabling the plugin
		return {
			enabled: false,
			initLocalIdSize: currentState.initLocalIdSize,
			localIdStatus: new Map(),
			lastUpdated: Date.now(),
		};
	}

	// If nothing changed, return the same state object
	if (!modified) {
		return currentState;
	}

	// If we exceeded the max size while processing the steps, we need to disable the watchmen from further processing.
	// If a Map size limit of 2^24 is exceeded then it's more than likely an error would have been thrown during processing
	// which would also disable this plugin.
	if (localIdStatus.size >= MAX_LOCAL_ID_MAP_SIZE) {
		return {
			enabled: false,
			initLocalIdSize: currentState.initLocalIdSize,
			localIdStatus: new Map(),
			lastUpdated: Date.now(),
		};
	}

	// Return new state with updated sets
	return {
		enabled: true,
		initLocalIdSize: currentState.initLocalIdSize,
		localIdStatus,
		lastUpdated: Date.now(),
	};
};

/**
 * Creates the localId watchmen plugin
 */
export const createWatchmenPlugin = (api: ExtractInjectionAPI<LocalIdPlugin> | undefined) => {
	// Ensure limited mode is initialized
	return new SafePlugin<LocalIdWatchmenState>({
		key: localIdWatchmenPluginKey,
		state: {
			init(_config, state: EditorState): LocalIdWatchmenState {
				const isLimitedModeEnabled = api?.limitedMode?.sharedState.currentState()?.enabled ?? false;
				if (isLimitedModeEnabled) {
					return {
						enabled: false,
						initLocalIdSize: -1,
						localIdStatus: new Map(),
						lastUpdated: Date.now(),
					};
				}

				// Initialize by scanning the entire document
				const activeLocalIds = scanDocumentForLocalIds(state.doc);

				if (activeLocalIds.size >= MAX_LOCAL_ID_MAP_SIZE) {
					return {
						enabled: false,
						initLocalIdSize: activeLocalIds.size,
						localIdStatus: new Map(),
						lastUpdated: Date.now(),
					};
				}

				return {
					enabled: true,
					initLocalIdSize: activeLocalIds.size,
					localIdStatus: new Map(Array.from(activeLocalIds).map((key) => [key, 'current'])),
					lastUpdated: Date.now(),
				};
			},
			apply(
				tr: ReadonlyTransaction,
				currentPluginState: LocalIdWatchmenState,
			): LocalIdWatchmenState {
				const { enabled } = tr.getMeta(localIdWatchmenPluginKey) || {
					enabled: currentPluginState.enabled,
				};

				const newPluginState = currentPluginState;

				if (enabled !== currentPluginState.enabled) {
					// If this plugin enabled state is changing and it's being disabled at runtime then we will kill this plugin
					// to avoid tracking localIds when in limited mode or there after.
					// Once disabled it cannot be re-enabled without a full editor reload.
					if (!enabled) {
						return {
							enabled: false,
							initLocalIdSize: currentPluginState.initLocalIdSize,
							localIdStatus: currentPluginState.localIdStatus,
							lastUpdated: Date.now(),
						};
					}
				}

				if (!newPluginState.enabled) {
					// If this plugin has been disabled, do not track localIds.
					return newPluginState;
				}

				// If no steps, nothing changed
				if (tr.steps.length === 0 || !tr.docChanged) {
					return newPluginState;
				}

				// Process the transaction to update state
				return processTransaction(tr, newPluginState);
			},
		},
		view(editorView) {
			// If limited mode changes, for example if we start not limited but then all of a sudden become limited, we kill
			// the watchment plugin to avoid tracking localIds when in limited mode. We also don't want/need to re-enable it once it's disabled.
			const unsub = api?.limitedMode?.sharedState.onChange(({ nextSharedState }) => {
				const watchmentPluginState = localIdWatchmenPluginKey.getState(editorView.state);
				if (nextSharedState.enabled && watchmentPluginState?.enabled === true) {
					// if nextSharedState.enabled === true, then we need to disable the watchmen plugin, if not already disabled
					editorView.dispatch(
						editorView.state.tr.setMeta(localIdWatchmenPluginKey, {
							enabled: false,
						}),
					);
				}
			});
			return {
				destroy: unsub,
			};
		},
	});
};
