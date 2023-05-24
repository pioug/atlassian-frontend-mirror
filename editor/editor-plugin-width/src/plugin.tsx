import { PluginKey } from 'prosemirror-state';

import { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
  EditorContainerWidth,
  NextEditorPlugin,
} from '@atlaskit/editor-common/types';

export type WidthPluginState = EditorContainerWidth;

export const pluginKey = new PluginKey<WidthPluginState>('widthPlugin');

function createPlugin(
  dispatch: Dispatch<WidthPluginState>,
): SafePlugin | undefined {
  return new SafePlugin({
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

export const widthPlugin: NextEditorPlugin<
  'width',
  {
    sharedState: EditorContainerWidth | undefined;
  }
> = () => ({
  name: 'width',

  pmPlugins: () => [
    {
      name: 'width',
      plugin: ({ dispatch }) => createPlugin(dispatch),
    },
  ],

  getSharedState: editorState => {
    if (!editorState) {
      return undefined;
    }

    return pluginKey.getState(editorState);
  },

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
