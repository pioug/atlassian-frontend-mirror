import { dataConsumer } from '@atlaskit/adf-schema';
import { NextEditorPlugin } from '@atlaskit/editor-common/types';

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
