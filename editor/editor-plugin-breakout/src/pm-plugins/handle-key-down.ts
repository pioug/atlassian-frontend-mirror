import { browser as browserLegacy, getBrowserInfo } from '@atlaskit/editor-common/browser';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { getBreakoutResizableNodeTypes } from '@atlaskit/editor-common/utils';
import type { NodeType } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { NodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	akEditorDefaultLayoutWidth,
	akEditorFullWidthLayoutWidth,
} from '@atlaskit/editor-shared-styles';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { BreakoutPlugin } from '../breakoutPluginType';
import { setBreakoutWidth } from '../editor-commands/set-breakout-width';

const KEYBOARD_RESIZE_STEP = 10;

const getAncestorResizableNode = (
	view: EditorView,
	breakoutResizableNodes: Set<NodeType>,
): NodeWithPos | null => {
	const selection = view.state.selection;

	if (selection instanceof NodeSelection) {
		const selectedNode = selection.node;
		if (breakoutResizableNodes.has(selectedNode.type)) {
			return { node: selectedNode, pos: selection.$from.pos };
		}
	} else if (selection instanceof TextSelection) {
		let node = null;
		let nodePos = null;

		// only top level nodes are resizable
		const resolvedPos = view.state.doc.resolve(selection.$from.pos);
		const currentNode = resolvedPos.node(1);
		if (breakoutResizableNodes.has(currentNode.type)) {
			node = currentNode;
			nodePos = resolvedPos.before(1);
			return { node: node, pos: nodePos };
		}
	}

	return null;
};

export const handleKeyDown =
	(api: ExtractInjectionAPI<BreakoutPlugin> | undefined) =>
	(view: EditorView, event: KeyboardEvent): boolean => {
		const browser = expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
			? getBrowserInfo()
			: browserLegacy;
		const metaKey = browser.mac ? event.metaKey : event.ctrlKey;
		const isBracketKey = event.code === 'BracketRight' || event.code === 'BracketLeft';
		if (metaKey && event.altKey && isBracketKey) {
			const { expand, codeBlock, layoutSection } = view.state.schema.nodes;
			const breakoutResizableNodes = editorExperiment('platform_synced_block', true)
				? getBreakoutResizableNodeTypes(view.state.schema)
				: new Set([expand, codeBlock, layoutSection]);

			const result = getAncestorResizableNode(view, breakoutResizableNodes);
			if (result) {
				const { node, pos } = result;

				const breakoutMark = node?.marks.find((mark) => mark.type.name === 'breakout');
				if (breakoutMark) {
					const step = event.code === 'BracketRight' ? KEYBOARD_RESIZE_STEP : -KEYBOARD_RESIZE_STEP;

					const newWidth = breakoutMark.attrs.width + step;
					if (newWidth < akEditorFullWidthLayoutWidth && newWidth > akEditorDefaultLayoutWidth) {
						const isEditMode = api?.editorViewMode?.sharedState.currentState()?.mode === 'edit';

						setBreakoutWidth(
							breakoutMark.attrs.width + step,
							breakoutMark.attrs.mode,
							pos,
							isEditMode,
						)(view.state, view.dispatch);
						view.focus();
					}

					return true;
				}
			}
		}

		return false;
	};
