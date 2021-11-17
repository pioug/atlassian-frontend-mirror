import { fragment } from '@atlaskit/adf-schema';
import { Plugin } from 'prosemirror-state';
import { pluginKey } from './plugin-key';
import { EditorPlugin } from '../../types';

export function createPlugin(): Plugin {
  return new Plugin({
    key: pluginKey,
  });
}

const fragmentMarkPlugin = (): EditorPlugin => ({
  name: 'fragmentPlugin',

  marks() {
    return [
      {
        name: 'fragment',
        mark: fragment,
      },
    ];
  },
});

export default fragmentMarkPlugin;
