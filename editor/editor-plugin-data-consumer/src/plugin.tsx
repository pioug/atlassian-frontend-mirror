import { dataConsumer } from '@atlaskit/adf-schema';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

export type DataConsumerPlugin = NextEditorPlugin<'dataConsumer'>;

export const dataConsumerPlugin: DataConsumerPlugin = () => ({
  name: 'dataConsumer',

  marks() {
    return [
      {
        name: 'dataConsumer',
        mark: dataConsumer,
      },
    ];
  },
});
