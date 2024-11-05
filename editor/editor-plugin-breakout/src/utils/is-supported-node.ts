import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';

const supportedNodesForBreakout = ['codeBlock', 'layoutSection', 'expand'];

const supportedNodesForBreakoutAdvancedLayouts = ['codeBlock', 'expand'];

/**
 * Check if breakout can be applied to a node
 * @param node Node to check
 */
export function isSupportedNodeForBreakout(node: PMNode): boolean {
	if (fg('platform_editor_advanced_layouts_breakout_resizing')) {
		return supportedNodesForBreakoutAdvancedLayouts.indexOf(node.type.name) !== -1;
	}
	return supportedNodesForBreakout.indexOf(node.type.name) !== -1;
}
