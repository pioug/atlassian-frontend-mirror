import type { NodeViewConstructor } from '@atlaskit/editor-common/lazy-node-view';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

const injectNodeViewNodeTypeList: readonly string[] = [
	'paragraph',
	'heading',
	'bulletList',
	'orderedList',
	'blockquote',
	'rule',
	'decisionList',
	'taskList',
	'layoutColumn',
	'hardBreak',
] as const;

const injectNodeViewNodeTypeConditionalList: readonly string[] = [
	...injectNodeViewNodeTypeList,
	// nodes that have custom nodeView behind experiment/FG
	'layoutSection',
] as const;

const key = new PluginKey('editorNativeAnchorSupportPlugin');

// Internal plugin to enable native anchor support in the editor.
// This plugin injects node views for specific node types (e.g., 'paragraph', 'heading')
// that do not already have a nodeView, allowing them to be rendered with native anchors when needed.
export const createEditorNativeAnchorSupportPlugin = (schema: Schema) => {
	const nodeViewEntries: [string, NodeViewConstructor][] = [];

	const injectList = expValEquals('advanced_layouts', 'isEnabled', true) && !expValEquals('platform_editor_breakout_resizing', 'isEnabled', true)
		? injectNodeViewNodeTypeList
		: injectNodeViewNodeTypeConditionalList;

	schema.spec.nodes.forEach((nodeName, nodeSpec) => {
		if (injectList.includes(nodeName)) {
			if (nodeSpec.toDOM && typeof nodeSpec.toDOM === 'function') {
				const toDOM = nodeSpec.toDOM.bind(nodeSpec);
				nodeViewEntries.push([
					nodeName,
					(node: PMNode) => DOMSerializer.renderSpec(document, toDOM(node)),
				]);
			}
		}
	});

	return new SafePlugin({
		key,
		props: {
			nodeViews: Object.fromEntries(nodeViewEntries),
		},
	});
};
