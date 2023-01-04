import { dataConsumer } from '@atlaskit/adf-schema';
import { Plugin } from 'prosemirror-state';
import { pluginKey } from './plugin-key';
import { NextEditorPlugin } from '@atlaskit/editor-common/types';

export function createPlugin(): Plugin | undefined {
  return new Plugin({
    key: pluginKey,
  });
}

const dataConsumerMarkPlugin: NextEditorPlugin<'dataConsumerPlugin'> = () => ({
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
