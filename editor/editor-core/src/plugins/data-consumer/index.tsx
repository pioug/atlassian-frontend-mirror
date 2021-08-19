import { dataConsumer } from '@atlaskit/adf-schema';
import { Plugin } from 'prosemirror-state';
import { pluginKey } from './plugin-key';
import { EditorPlugin } from '../../types';

export function createPlugin(): Plugin | undefined {
  return new Plugin({
    key: pluginKey,
  });
}

const dataConsumerMarkPlugin = (): EditorPlugin => ({
  name: 'dataConsumerPlugin',

  marks() {
    return [
      {
        name: 'dataConsumer',
        mark: dataConsumer,
      },
    ];
  },
});

export default dataConsumerMarkPlugin;
