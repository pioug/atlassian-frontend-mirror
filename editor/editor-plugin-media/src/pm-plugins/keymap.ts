import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
  bindKeymapWithCommand,
  enter,
  insertNewLine,
  moveDown,
  moveLeft,
  moveRight,
  tab,
  undo,
} from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { GapCursorSelection, Side } from '@atlaskit/editor-common/selection';
import type { Command } from '@atlaskit/editor-common/types';
import type { EditorSelectionAPI } from '@atlaskit/editor-plugin-selection';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { getMediaFeatureFlag } from '@atlaskit/media-common';

import {
  insertAndSelectCaptionFromMediaSinglePos,
  selectCaptionFromMediaSinglePos,
} from '../commands/captions';
import { stateKey } from '../pm-plugins/plugin-key';
import type { MediaOptions } from '../types';

import type { MediaPluginState } from './types';

export function keymapPlugin(
  options: MediaOptions | undefined,
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
  editorSelectionAPI: EditorSelectionAPI | undefined,
): SafePlugin {
  const list = {};
  const { featureFlags } = options || {};

  bindKeymapWithCommand(undo.common!, ignoreLinksInSteps, list);
  bindKeymapWithCommand(enter.common!, splitMediaGroup, list);

  if (options?.allowCaptions || getMediaFeatureFlag('captions', featureFlags)) {
    bindKeymapWithCommand(
      moveDown.common!,
      insertAndSelectCaption(editorAnalyticsAPI),
      list,
    );
    bindKeymapWithCommand(
      tab.common!,
      insertAndSelectCaption(editorAnalyticsAPI),
      list,
    );

    bindKeymapWithCommand(
      moveLeft.common!,
      arrowLeftFromMediaSingle(editorSelectionAPI),
      list,
    );
    bindKeymapWithCommand(
      moveRight.common!,
      arrowRightFromMediaSingle(editorSelectionAPI),
      list,
    );
  }

  bindKeymapWithCommand(insertNewLine.common!, splitMediaGroup, list);

  return keymap(list) as SafePlugin;
}

const ignoreLinksInSteps: Command = state => {
  const mediaPluginState = stateKey.getState(state) as MediaPluginState;
  mediaPluginState.ignoreLinks = true;
  return false;
};

const splitMediaGroup: Command = state => {
  const mediaPluginState = stateKey.getState(state) as MediaPluginState;
  return mediaPluginState.splitMediaGroup();
};

const insertAndSelectCaption =
  (editorAnalyticsAPI: EditorAnalyticsAPI | undefined): Command =>
  (state, dispatch) => {
    const { selection, schema } = state;
    if (
      selection instanceof NodeSelection &&
      selection.node.type === schema.nodes.mediaSingle &&
      schema.nodes.caption
    ) {
      if (dispatch) {
        const { from, node } = selection;
        if (
          !insertAndSelectCaptionFromMediaSinglePos(editorAnalyticsAPI)(
            from,
            node,
          )(state, dispatch)
        ) {
          selectCaptionFromMediaSinglePos(from, node)(state, dispatch);
        }
      }
      return true;
    }
    return false;
  };

const arrowLeftFromMediaSingle =
  (editorSelectionAPI: EditorSelectionAPI | undefined | null): Command =>
  (state, dispatch) => {
    const { selection } = state;
    if (
      editorSelectionAPI &&
      selection instanceof NodeSelection &&
      selection.node.type.name === 'mediaSingle'
    ) {
      const tr = editorSelectionAPI.selectNearNode({
        selectionRelativeToNode: undefined,
        selection: new GapCursorSelection(
          state.doc.resolve(selection.from),
          Side.LEFT,
        ),
      })(state);

      if (dispatch) {
        dispatch(tr);
      }
      return true;
    }

    return false;
  };

const arrowRightFromMediaSingle =
  (editorSelectionAPI: EditorSelectionAPI | undefined | null): Command =>
  (state, dispatch) => {
    const { selection } = state;
    if (
      editorSelectionAPI &&
      selection instanceof NodeSelection &&
      selection.node.type.name === 'mediaSingle'
    ) {
      const tr = editorSelectionAPI.selectNearNode({
        selectionRelativeToNode: undefined,
        selection: new GapCursorSelection(
          state.doc.resolve(selection.to),
          Side.RIGHT,
        ),
      })(state);

      if (dispatch) {
        dispatch(tr);
      }
      return true;
    }

    return false;
  };

export default keymapPlugin;
