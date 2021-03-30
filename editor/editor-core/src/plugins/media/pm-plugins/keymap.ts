import { keymap } from 'prosemirror-keymap';
import { Plugin, NodeSelection } from 'prosemirror-state';
import * as keymaps from '../../../keymaps';
import { stateKey } from '../pm-plugins/plugin-key';
import { Command } from '../../../types';
import { MediaPluginState } from './types';
import { getMediaFeatureFlag } from '@atlaskit/media-common';
import { MediaOptions } from '../types';
import { setSelectCaptionFromMediaSinglePos } from '../commands/captions';

export function keymapPlugin(options?: MediaOptions): Plugin {
  const list = {};
  const { featureFlags } = options || {};

  keymaps.bindKeymapWithCommand(keymaps.undo.common!, ignoreLinksInSteps, list);
  keymaps.bindKeymapWithCommand(keymaps.enter.common!, splitMediaGroup, list);
  if (getMediaFeatureFlag('captions', featureFlags)) {
    keymaps.bindKeymapWithCommand(
      keymaps.moveDown.common!,
      insertAndSelectCaption,
      list,
    );
    keymaps.bindKeymapWithCommand(
      keymaps.tab.common!,
      insertAndSelectCaption,
      list,
    );
  }
  keymaps.bindKeymapWithCommand(
    keymaps.insertNewLine.common!,
    splitMediaGroup,
    list,
  );

  return keymap(list);
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

const insertAndSelectCaption: Command = (state, dispatch) => {
  const { selection, schema } = state;
  if (
    selection instanceof NodeSelection &&
    selection.node.type === schema.nodes.mediaSingle &&
    schema.nodes.caption
  ) {
    if (dispatch) {
      const { from, node } = selection;
      const { tr } = state;
      let customTr = tr;
      if (node.childCount !== 1) {
        setSelectCaptionFromMediaSinglePos(from, node, customTr);
        dispatch(customTr);
      }
    }
    return true;
  }
  return false;
};

export default keymapPlugin;
