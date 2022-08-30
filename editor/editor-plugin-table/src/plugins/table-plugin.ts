import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { pluginKey } from './plugin-key';
import { Mark } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

function createPlugin() {
  return new SafePlugin({
    key: pluginKey,
    state: {
      init() {
        const z = { Mark, EditorView };
        // eslint-disable-next-line no-console
        console.log('delete to use prosemirror-model/view', z);
        // eslint-disable-next-line no-console
        console.log('next table plugin loaded');
        return {
          scaffold: true,
        };
      },
      apply() {},
    },
  });
}

// const tablesPlugin = (options?: TablePluginOptions): any => ({
const tablesPlugin = (): any => ({
  name: 'nextTable',
  pmPlugins() {
    return [
      {
        name: 'next-table-scaffold',
        plugin: () => {
          return createPlugin();
        },
      },
    ];
  },
});

export default tablesPlugin;
