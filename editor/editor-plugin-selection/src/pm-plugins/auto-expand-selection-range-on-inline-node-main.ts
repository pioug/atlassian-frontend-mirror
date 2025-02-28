import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { autoExpandSelectionRangeOnInlineNodePluginKey } from './auto-expand-selection-range-on-inline-node-key';

export const createAutoExpandSelectionRangeOnInlineNodePlugin = () => {
	let mouseDownElement: HTMLElement | null = null;

	return new SafePlugin({
		key: autoExpandSelectionRangeOnInlineNodePluginKey,
		props: {
			handleDOMEvents: {
				mousedown: (_view, event) => {
					// Ignored via go/ees005
					// eslint-disable-next-line @atlaskit/editor/no-as-casting
					mouseDownElement = event.target as HTMLElement;
				},
				mouseup: (view, event) => {
					// Ignored via go/ees005
					// eslint-disable-next-line @atlaskit/editor/no-as-casting
					const mouseUpElement = event.target as HTMLElement;

					if (fg('platform_editor_lcm_inline_node_selection_fix')) {
						// terminate early if mouse down and mouse up elements are the same -> e.g a click event
						// or mouse down doesn't trigger
						if (!mouseDownElement || mouseDownElement === mouseUpElement) {
							mouseDownElement = null;
							return;
						}
						// reset mouse down element after mouse up event
						// so that we can detect the next mouse down event is triggered right after mouse up event or not
						mouseDownElement = null;
					} else {
						// terminate early if mouse down and mouse up elements are the same -> e.g a click event
						if (mouseDownElement === mouseUpElement) {
							return;
						}
					}

					// terminate early if mouse up event is not fired on inline node
					if (!isMouseUpOnSupportedNode(mouseUpElement)) {
						return;
					}

					const { dispatch, state } = view;
					const { selection } = state;

					// terminate early if current selection is not a text selection -> e.g. table cell selection
					if (!(selection instanceof TextSelection)) {
						return;
					}

					// only expand range when experiment is enabled, also fire exposure events here
					if (
						editorExperiment('expand_selection_range_to_include_inline_node', true, {
							exposure: true,
						})
					) {
						// find the document position of the mouse up element
						const elementStartPosition = view.posAtDOM(mouseUpElement, 0);

						// find out the direction of selection
						const isAnchorBeforeElement = selection.$anchor.pos <= elementStartPosition;
						const expandedSelectionHeadPosition = isAnchorBeforeElement
							? elementStartPosition + 1
							: elementStartPosition;

						// expand the selection to include the mouse up element
						const tr = state.tr.setSelection(
							TextSelection.create(state.doc, selection.$anchor.pos, expandedSelectionHeadPosition),
						);
						dispatch(tr);
					}
				},
			},
		},
	});
};

const isMouseUpOnSupportedNode = (mouseUpElement: HTMLElement) => {
	const supportedNodes = ['emoji', 'status', 'date', 'mention', 'inlineCard'];
	const supportedNodeViewContentClassNamesList = supportedNodes
		.map((nodeType) => `.${nodeType}View-content-wrap`)
		.join(', ');
	return !!mouseUpElement.closest(supportedNodeViewContentClassNamesList);
};
