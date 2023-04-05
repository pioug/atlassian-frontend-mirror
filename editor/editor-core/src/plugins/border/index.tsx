import { border } from '@atlaskit/adf-schema';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

const borderPlugin: NextEditorPlugin<'border'> = () => ({
  name: 'border',

  marks() {
    return [
      {
        name: 'border',
        mark: border,
      },
    ];
  },
});

export default borderPlugin;
