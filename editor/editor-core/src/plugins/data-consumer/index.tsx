import { dataConsumer } from '@atlaskit/adf-schema';
import { Plugin } from 'prosemirror-state';
import { pluginKey } from './plugin-key';
import { EditorPlugin } from '../../types';
import { DataConsumerPluginOptions } from './types';

export function createPlugin(): Plugin | undefined {
  return new Plugin({
    key: pluginKey,
  });
}

const dataConsumerMarkPlugin = (
  options: DataConsumerPluginOptions = {},
): EditorPlugin => ({
  name: 'dataConsumerPlugin',

  marks() {
    return options.allowDataConsumerMarks
      ? [
          {
            name: 'dataConsumer',
            mark: dataConsumer,
          },
        ]
      : [];
  },
});

export default dataConsumerMarkPlugin;
