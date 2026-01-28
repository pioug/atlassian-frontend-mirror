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
 * Counts nodes in the document.
 *
 * Note: legacy-content macros add a damped contribution based on ADF length to avoid
 * parsing nested ADF on every check, which is inefficient.
 */
const countNodesInDoc = (doc: PMNode, lcmDampingFactor: number): number => {
	let nodeCount = 0;
	doc.descendants((node: PMNode) => {
		nodeCount += 1;

		if (node.attrs?.extensionKey === 'legacy-content') {
			const adfLength = node.attrs?.parameters?.adf?.length;

			if (typeof adfLength === 'number' && lcmDampingFactor > 0) {
				nodeCount += Math.ceil(adfLength / lcmDampingFactor);
			}
		}
	});

	return nodeCount;
};

/**
 * Guard against test overrides returning booleans for numeric params.
 */
const getNumericExperimentParam = (
	experimentName: 'cc_editor_limited_mode_expanded',
	paramName: 'lcmNodeCountDampingFactor' | 'nodeCountThreshold',
	fallbackValue: number,
): number => {
	const rawValue = expVal(experimentName, paramName, fallbackValue);

	if (typeof rawValue === 'number') {
		return rawValue;
	}

	return fallbackValue;
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
					const lcmNodeCountDampingFactor = getNumericExperimentParam(
						'cc_editor_limited_mode_expanded',
						'lcmNodeCountDampingFactor',
						10,
					);
					const nodeCountThreshold = getNumericExperimentParam(
						'cc_editor_limited_mode_expanded',
						'nodeCountThreshold',
						1000,
					);
					const nodeCount = countNodesInDoc(
						editorState.doc,
						lcmNodeCountDampingFactor,
					);

					return {
						documentSizeBreachesThreshold: nodeCount > nodeCountThreshold,
					};
				} else {
					// calculates the size of the doc, where when there are legacy content macros, the content
					// is stored in the attrs.
					// This is essentiall doc.nod
					let customDocSize = editorState.doc.nodeSize;

					editorState.doc.descendants((node: PMNode) => {
						if (node.attrs?.extensionKey === 'legacy-content') {
							customDocSize += node.attrs?.parameters?.adf?.length ?? 0;
						}
					});

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
					const lcmNodeCountDampingFactor = getNumericExperimentParam(
						'cc_editor_limited_mode_expanded',
						'lcmNodeCountDampingFactor',
						10,
					);
					const nodeCountThreshold = getNumericExperimentParam(
						'cc_editor_limited_mode_expanded',
						'nodeCountThreshold',
						1000,
					);
					const nodeCount = countNodesInDoc(
						tr.doc,
						lcmNodeCountDampingFactor,
					);

					return {
						documentSizeBreachesThreshold: nodeCount > nodeCountThreshold,
					};
				} else {
					// calculates the size of the doc, where when there are legacy content macros, the content
					// is stored in the attrs.
					// This is essentiall doc.nod
					let customDocSize = tr.doc.nodeSize;

					tr.doc.descendants((node: PMNode) => {
						if (node.attrs?.extensionKey === 'legacy-content') {
							customDocSize += node.attrs?.parameters?.adf?.length ?? 0;
						}
					});

					return {
						documentSizeBreachesThreshold: customDocSize > LIMITED_MODE_NODE_SIZE_THRESHOLD,
					};
				}
			},
		},
	});
};
