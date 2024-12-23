import { browser } from '@atlaskit/editor-common/browser';
import { bindKeymapWithCommand, moveDown, moveUp } from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { Command, FeatureFlags } from '@atlaskit/editor-common/types';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { findChildren, flatten } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

const lookupPixel = 10;

type Direction = 'up' | 'down';

const getClosestInlineCardPos = (
	state: EditorState,
	editorView: EditorView,
	direction: Direction,
): number | null => {
	const { selection } = state;

	const { parent } = selection.$from;

	const inlineCardType = state.schema.nodes.inlineCard;

	if (!flatten(parent, false).some(({ node }) => node.type === inlineCardType)) {
		return null;
	}

	const coord = editorView.coordsAtPos(selection.$anchor.pos);

	const nearPos = editorView.posAtCoords({
		left: coord.left,
		top: direction === 'up' ? coord.top - lookupPixel : coord.bottom + lookupPixel,
	})?.inside;

	if (typeof nearPos === 'number' && nearPos > -1) {
		const newNode = state.doc.nodeAt(nearPos);
		if (newNode) {
			if (
				newNode.type !== inlineCardType ||
				findChildren(parent, (node) => node === newNode, false).length === 0 ||
				newNode === (selection as NodeSelection).node
			) {
				return null;
			}

			return nearPos;
		}
	}

	return null;
};

const selectAboveBelowInlineCard = (direction: Direction): Command => {
	return (state, dispatch, editorView) => {
		if (!editorView || !dispatch) {
			return false;
		}
		const pos = getClosestInlineCardPos(state, editorView, direction);

		if (pos) {
			dispatch(state.tr.setSelection(new NodeSelection(state.doc.resolve(pos))));
			return true;
		}

		return false;
	};
};

export function cardKeymap(featureFlags: FeatureFlags): SafePlugin {
	const list = {};

	// https://bugs.chromium.org/p/chromium/issues/detail?id=1227468 introduced since Chrome 91
	if (browser.chrome && browser.chrome_version > 90) {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		bindKeymapWithCommand(moveUp.common!, selectAboveBelowInlineCard('up'), list);

		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		bindKeymapWithCommand(moveDown.common!, selectAboveBelowInlineCard('down'), list);
	}

	return keymap(list) as SafePlugin;
}
