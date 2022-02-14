import { keymap } from 'prosemirror-keymap';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { NodeSelection, EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import * as keymaps from '../../../keymaps';
import { Command } from '../../../types';
import { findChildren, flatten } from 'prosemirror-utils';
import { FeatureFlags } from '../../../types/feature-flags';
import { browser } from '@atlaskit/editor-common/utils';

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

  if (
    !flatten(parent, false).some(({ node }) => node.type === inlineCardType)
  ) {
    return null;
  }

  const coord = editorView.coordsAtPos(selection.$anchor.pos);

  const nearPos = editorView.posAtCoords({
    left: coord.left,
    top:
      direction === 'up' ? coord.top - lookupPixel : coord.bottom + lookupPixel,
  })?.pos;

  if (nearPos) {
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
      dispatch(
        state.tr.setSelection(new NodeSelection(state.doc.resolve(pos))),
      );
      return true;
    }

    return false;
  };
};

export function cardKeymap(featureFlags: FeatureFlags): SafePlugin {
  const list = {};

  // https://bugs.chromium.org/p/chromium/issues/detail?id=1227468 introduced since Chrome 91
  if (
    browser.chrome &&
    browser.chrome_version > 90 &&
    featureFlags.chromeCursorHandlerFixedVersion &&
    browser.chrome_version < featureFlags.chromeCursorHandlerFixedVersion
  ) {
    keymaps.bindKeymapWithCommand(
      keymaps.moveUp.common!,
      selectAboveBelowInlineCard('up'),
      list,
    );

    keymaps.bindKeymapWithCommand(
      keymaps.moveDown.common!,
      selectAboveBelowInlineCard('down'),
      list,
    );
  }

  return keymap(list) as SafePlugin;
}
