import { Plugin, PluginKey } from 'prosemirror-state';

import { Dispatch } from '../../event-dispatcher';
import { EditorPlugin } from '../../types';

export type WidthPluginState = {
  width: number;
  containerWidth?: number;
  lineLength?: number;
};

export const pluginKey = new PluginKey<WidthPluginState>('widthPlugin');

export function createPlugin(
  dispatch: Dispatch<WidthPluginState>,
): Plugin | undefined {
  return new Plugin({
    key: pluginKey,
    state: {
      init: () =>
        ({
          width: document.body.offsetWidth,
          containerWidth: document.body.offsetWidth,
        } as WidthPluginState),
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
          (newPluginState &&
            (pluginState.width !== newPluginState.width ||
              pluginState.lineLength !== newPluginState.lineLength)) ||
          pluginState.containerWidth !== newPluginState.containerWidth
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

      // wrapper width is used by context panel to determine whether there is
      // enough space to open without overlapping the editor
      newState.containerWidth = containerElement.parentElement?.offsetWidth;
    }

    const tr = editorView.state.tr.setMeta(pluginKey, newState);
    editorView.dispatch(tr);
    return null;
  },
});

export default widthPlugin;
