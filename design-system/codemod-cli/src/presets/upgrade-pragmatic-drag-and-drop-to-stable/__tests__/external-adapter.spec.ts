jest.autoMockOff();

import { pleaseMigrateMessage } from '../transformers/external-adapter';
import transformer from '../upgrade-pragmatic-drag-and-drop-to-stable';
import { check } from './_framework';

describe('file adapter => external adapter', () => {
  check({
    transformer,
    it: 'should transform file adapter usages',
    original: `
      import {monitorForFiles, dropTargetForFiles} from '@atlaskit/pragmatic-drag-and-drop/adapter/file';

      dropTargetForFiles({
        element,
        onDrop: () => console.log('dropTarget:drop'),
      });

      monitorForFiles({
        onDrop: () => console.log('monitor:drop'),
      });
      `,
    expected: `
      /* TODO: (from codemod) ${pleaseMigrateMessage} */
      import {monitorForExternal, dropTargetForExternal} from '@atlaskit/pragmatic-drag-and-drop/external/adapter';
      import {containsFiles, getFiles} from '@atlaskit/pragmatic-drag-and-drop/external/file';

      dropTargetForExternal({
        element,
        onDrop: () => console.log('dropTarget:drop'),
      });

      monitorForExternal({
        onDrop: () => console.log('monitor:drop'),
      });
    `,
  });
});
