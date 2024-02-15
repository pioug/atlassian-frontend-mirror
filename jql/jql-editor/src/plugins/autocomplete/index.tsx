import { keydownHandler } from '@atlaskit/editor-prosemirror/keymap';
import { Plugin } from '@atlaskit/editor-prosemirror/state';
import { EditorView } from '@atlaskit/editor-prosemirror/view';

import { JQLEditorCommand } from '../../schema';
import { PortalActions } from '../../ui/jql-editor-portal-provider/types';
import { PluginKeymap } from '../common/plugin-keymap';

import {
  ARROW_DOWN_KEY,
  ARROW_UP_KEY,
  CMD_ARROW_DOWN_KEY,
  CMD_ARROW_UP_KEY,
  END_KEY,
  ENTER_KEY,
  ESCAPE_KEY,
  HOME_KEY,
  JQLAutocompletePluginKey,
  TAB_KEY,
} from './constants';
import AutocompletePluginView from './view';

const getKeyHandler =
  (keymap: PluginKeymap, key: string): JQLEditorCommand =>
  (state, dispatch, view) => {
    const binding = keymap.getKeyBinding(key);
    return binding ? binding(state, dispatch, view) : false;
  };

const autocompletePlugin = (
  portalActions: PortalActions,
  enableRichInlineNodes: boolean,
) => {
  // Empty keymap passed down to the React component so it can register key bindings
  const keymap = new PluginKeymap();
  return new Plugin<void>({
    key: JQLAutocompletePluginKey,
    view: (editorView: EditorView) => {
      const view = new AutocompletePluginView(
        editorView,
        keymap,
        portalActions,
        enableRichInlineNodes,
      );
      // Initialise view to mount the react component
      view.init();
      return view;
    },
    props: {
      handleKeyDown: keydownHandler({
        [ARROW_UP_KEY]: getKeyHandler(keymap, ARROW_UP_KEY),
        [ARROW_DOWN_KEY]: getKeyHandler(keymap, ARROW_DOWN_KEY),
        [CMD_ARROW_UP_KEY]: getKeyHandler(keymap, CMD_ARROW_UP_KEY),
        [CMD_ARROW_DOWN_KEY]: getKeyHandler(keymap, CMD_ARROW_DOWN_KEY),
        [HOME_KEY]: getKeyHandler(keymap, HOME_KEY),
        [END_KEY]: getKeyHandler(keymap, END_KEY),
        [ESCAPE_KEY]: getKeyHandler(keymap, ESCAPE_KEY),
        [ENTER_KEY]: getKeyHandler(keymap, ENTER_KEY),
        [TAB_KEY]: getKeyHandler(keymap, TAB_KEY),
      }),
    },
  });
};

export default autocompletePlugin;
