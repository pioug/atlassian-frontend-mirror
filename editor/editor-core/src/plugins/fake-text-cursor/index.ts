import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { drawFakeTextCursor } from './cursor';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

export const stateKey = new PluginKey('fakeTextCursorPlugin');

export const createPlugin = () =>
  new SafePlugin({
    key: stateKey,
    props: {
      decorations: drawFakeTextCursor,
    },
  });

const fakeTextCursorPlugin: NextEditorPlugin<'fakeTextCursor'> = () => ({
  name: 'fakeTextCursor',

  pmPlugins() {
    return [{ name: 'fakeTextCursor', plugin: () => createPlugin() }];
  },
});

export default fakeTextCursorPlugin;
