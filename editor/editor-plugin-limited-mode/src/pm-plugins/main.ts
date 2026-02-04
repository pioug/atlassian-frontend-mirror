import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { expVal } from '@atlaskit/tmp-editor-statsig/expVal';

import type { LimitedModePluginState } from '../limitedModePluginType';

export const limitedModePluginKey = new PluginKey('limitedModePlugin');

const LIMITED_MODE_NODE_SIZE_THRESHOLD = 40000;

type EditorStateConfig = Parameters<typeof EditorState.create>[0];

/**
 * Gets a numeric experiment param, returning undefined if the value is not a valid number.
 * This guards against test overrides returning booleans or strings for numeric params.
 */
const getNumericExperimentParam = (
	paramName: 'nodeCountThreshold' | 'docSizeThreshold',
	fallbackValue: number,
): number | undefined => {
	const rawValue = expVal('cc_editor_limited_mode_expanded', paramName, fallbackValue);

	if (typeof rawValue === 'number') {
		return rawValue;
	}

	// Handle string values from test overrides
	if (typeof rawValue === 'string') {
		const parsed = parseInt(rawValue, 10);

		if (!isNaN(parsed)) {
			return parsed;
		}
	}

	return undefined;
};

/**
 * Calculates custom document size including LCM ADF lengths (for non-expanded path).
 * This function can be removed when cc_editor_limited_mode_expanded is cleaned up.
 */
const getCustomDocSize = (doc: PMNode): number => {
	let lcmAdfLength = 0;

	doc.descendants((node: PMNode) => {
		if (node.attrs?.extensionKey === 'legacy-content') {
			lcmAdfLength += node.attrs?.parameters?.adf?.length ?? 0;
		}
	});

	return doc.nodeSize + lcmAdfLength;
};

/**
 * Determines whether limited mode should be enabled under the expanded gate.
 * If this logic changes, update the duplicate in `editor-common/src/node-anchor/node-anchor-provider.ts` to avoid drift.
 *
 * Limited mode is activated when ANY of the following conditions are met:
 * 1. Document size exceeds `docSizeThreshold` (if defined)
 * 2. Node count exceeds `nodeCountThreshold` (if defined)
 * 3. Document contains a legacy-content macro (LCM) (if `includeLcmInThreshold` is true)
 *
 * Performance optimisations:
 * - Doc size is checked first (O(1)) - if it exceeds threshold, we skip traversal entirely.
 * - If `includeLcmInThreshold` is enabled and we find an LCM, we exit traversal early
 *   since we already know limited mode will be enabled.
 * - If neither node count nor LCM conditions are configured, we skip traversal entirely.
 */
const shouldEnableLimitedModeExpanded = (doc: PMNode): boolean => {
	const nodeCountThreshold = getNumericExperimentParam('nodeCountThreshold', 5000);
	const docSizeThreshold = getNumericExperimentParam('docSizeThreshold', 30000);
	const includeLcmInThreshold = Boolean(expVal('cc_editor_limited_mode_expanded', 'includeLcmInThreshold', false));

	// Early exit: doc size exceeds threshold - O(1), no traversal needed
	if (docSizeThreshold !== undefined && doc.nodeSize > docSizeThreshold) {
		return true;
	}

	// Early exit: no traversal needed if neither condition is configured
	const needNodeCount = nodeCountThreshold !== undefined;

	if (!needNodeCount && !includeLcmInThreshold) {
		return false;
	}

	// Single traversal for node count and/or LCM detection
	let nodeCount = 0;
	let hasLcm = false;

	doc.descendants((node: PMNode) => {
		nodeCount += 1;

		if (node.attrs?.extensionKey === 'legacy-content') {
			hasLcm = true;

			// Early exit: LCM found and condition is enabled - no need to continue counting
			if (includeLcmInThreshold) {
				return false;
			}
		}
	});

	// LCM condition takes precedence (if we early exited traversal, this is why)
	if (includeLcmInThreshold && hasLcm) {
		return true;
	}

	// Check node count threshold
	if (needNodeCount && nodeCount > nodeCountThreshold) {
		return true;
	}

	return false;
};

export const createPlugin = () => {
	return new SafePlugin<LimitedModePluginState>({
		key: limitedModePluginKey,
		view: (_view: EditorView) => {
			return {};
		},
		state: {
			init(config: EditorStateConfig, editorState: EditorState) {

				if (expVal('cc_editor_limited_mode_expanded', 'isEnabled', false)) {
					return {
						documentSizeBreachesThreshold: shouldEnableLimitedModeExpanded(editorState.doc),
					};
				} else {
					// calculates the size of the doc, where when there are legacy content macros, the content
					// is stored in the attrs.
					const customDocSize = getCustomDocSize(editorState.doc);

					return {
						documentSizeBreachesThreshold: customDocSize > LIMITED_MODE_NODE_SIZE_THRESHOLD,
					};
				}
			},
			apply: (
				tr: ReadonlyTransaction,
				currentPluginState: LimitedModePluginState,
				_oldState: EditorState,
				_newState: EditorState,
			) => {
				// Don't check the document size if we're already in limited mode.
				// We ALWAYS want to re-check the document size if we're replacing the document (e.g. live-to-live page navigation).

				if (currentPluginState.documentSizeBreachesThreshold && !tr.getMeta('replaceDocument')) {
					return currentPluginState;
				}

				if (expVal('cc_editor_limited_mode_expanded', 'isEnabled', false)) {
					return {
						documentSizeBreachesThreshold: shouldEnableLimitedModeExpanded(tr.doc),
					};
				} else {
					// calculates the size of the doc, where when there are legacy content macros, the content
					// is stored in the attrs.
					const customDocSize = getCustomDocSize(tr.doc);

					return {
						documentSizeBreachesThreshold: customDocSize > LIMITED_MODE_NODE_SIZE_THRESHOLD,
					};
				}
			},
		},
	});
};
