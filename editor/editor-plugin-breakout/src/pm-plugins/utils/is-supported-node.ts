import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

const supportedNodesForBreakout = ['codeBlock', 'layoutSection', 'expand'];

const supportedNodesForBreakoutAdvancedLayouts = ['codeBlock', 'expand'];

/**
 * Check if breakout can be applied to a node
 * @param node Node to check
 */
export function isSupportedNodeForBreakout(node: PMNode): boolean {
	if (editorExperiment('advanced_layouts', true)) {
		return supportedNodesForBreakoutAdvancedLayouts.indexOf(node.type.name) !== -1;
	}
	return supportedNodesForBreakout.indexOf(node.type.name) !== -1;
}
