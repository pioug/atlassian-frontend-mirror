import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { pluginKey } from './plugin-key';

export function copyButtonPlugin() {
  return new SafePlugin({
    state: {
      init() {
        return {
          copied: false,
        };
      },
      apply(tr, pluginState) {
        const meta = tr.getMeta(pluginKey);
        if (meta?.copied !== undefined) {
          return {
            copied: meta.copied,
          };
        }
        return pluginState;
      },
    },
    key: pluginKey,
  });
}

export default copyButtonPlugin;
