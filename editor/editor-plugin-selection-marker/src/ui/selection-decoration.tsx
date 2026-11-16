import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { token } from '@atlaskit/tokens';

const decorationStyle = `
    background-color: ${token('color.background.neutral')};
  `;

const decorationHighlightStyle = `
    background-color: ${token('color.background.accent.blue.subtlest')};
    border-bottom: ${token('border.width.selected')} solid ${token('color.background.accent.blue.subtler')};
  `;

/**
 * A node-selected inline atom keeps its own selected-node styling instead of the marker.
 */
const isMarkableInlineAtom = (node: PMNode, selection: Selection): boolean =>
	node.isInline && node.isAtom && !(selection instanceof NodeSelection && selection.node === node);

export const selectionDecoration = (
	doc: PMNode,
	selection: Selection,
	isHighlight: boolean,
): Decoration[] => {
	const selectionDecorations: Decoration[] = [];
	const style = isHighlight ? decorationHighlightStyle : decorationStyle;
	const shouldMarkInlineAtoms = fg('platform_editor_selection_marker_blur_fix');

	doc.nodesBetween(selection.from, selection.to, (currentNode, nodePos) => {
		if (!currentNode.isText) {
			if (shouldMarkInlineAtoms && isMarkableInlineAtom(currentNode, selection)) {
				selectionDecorations.push(
					Decoration.node(nodePos, nodePos + currentNode.nodeSize, {
						style,
						'data-testid': 'selection-marker-inline-node',
						'data-selection-marker': '',
					}),
				);
			}
			return true;
		}

		let decorationFrom = selection.from;
		let decorationTo = selection.to;

		if (nodePos > selection.from) {
			decorationFrom = nodePos;
		}

		if (nodePos + currentNode.nodeSize < selection.to) {
			decorationTo = nodePos + currentNode.nodeSize;
		}

		selectionDecorations.push(
			Decoration.inline(decorationFrom, decorationTo, {
				style,
				'data-testid': 'selection-marker-selection',
				'data-selection-marker': '',
			}),
		);
		return true;
	});

	return selectionDecorations;
};
