import { indentation } from '@atlaskit/adf-schema';
import type {
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import { keymapPlugin } from './pm-plugins/keymap';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';

const indentationPlugin: NextEditorPlugin<
  'indentation',
  { dependencies: [OptionalPlugin<AnalyticsPlugin>] }
> = ({ api }) => ({
  name: 'indentation',

  marks() {
    return [{ name: 'indentation', mark: indentation }];
  },

  pmPlugins() {
    return [
      {
        name: 'indentationKeymap',
        plugin: () => keymapPlugin(api?.analytics?.actions),
      },
    ];
  },
});

export default indentationPlugin;
