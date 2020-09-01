import { Plugin, PluginKey } from 'prosemirror-state';

import { Dispatch } from '../../event-dispatcher';
import { EditorPlugin } from '../../types';

export const pluginKey = new PluginKey('widthPlugin');

export type WidthPluginState = {
  width: number;
  lineLength?: number;
};

export function createPlugin(
  dispatch: Dispatch<WidthPluginState>,
): Plugin | undefined {
  return new Plugin({
    key: pluginKey,
    state: {
      init: () => ({
        width: document.body.offsetWidth,
      }),
      apply(tr, pluginState: WidthPluginState) {
        const meta: WidthPluginState | undefined = tr.getMeta(pluginKey);

        if (!meta) {
          return pluginState;
        }

        const newPluginState = {
          ...pluginState,
          ...meta,
        };

        if (
          newPluginState &&
          (pluginState.width !== newPluginState.width ||
            pluginState.lineLength !== newPluginState.lineLength)
        ) {
          dispatch(pluginKey, newPluginState);
          return newPluginState;
        }
        return pluginState;
      },
    },
  });
}

const widthPlugin = (): EditorPlugin => ({
  name: 'width',

  pmPlugins: () => [
    {
      name: 'width',
      plugin: ({ dispatch }) => createPlugin(dispatch),
    },
  ],

  // do this early here, otherwise we have to wait for WidthEmitter to debounce
  // which causes anything dependent on lineLength to jump around
  contentComponent({ editorView, containerElement }) {
    const newState: Partial<WidthPluginState> = {
      lineLength: editorView.dom.clientWidth,
    };

    if (containerElement) {
      newState.width = containerElement.offsetWidth;
    }

    const tr = editorView.state.tr.setMeta(pluginKey, newState);
    editorView.dispatch(tr);
    return null;
  },
});

export default widthPlugin;
