jest.autoMockOff();

import { check } from './_framework';

import transformer from '../upgrade-pragmatic-drag-and-drop-to-stable';

describe('cancelUnhandled() => preventUnhandled()', () => {
  check({
    transformer,
    it: 'should transform imports and usage',
    original: `
      import {monitorForElements} from '@atlaskit/pragmatic-drag-and-drop/adapter/element';
      import {cancelUnhandled} from '@atlaskit/pragmatic-drag-and-drop/addon/cancel-unhandled';

      monitorForElements({
        onDragStart() {
          cancelUnhandled.start();
        },
        onDrop() {
          cancelUnhandled.stop();
        }
      });
    `,
    expected: `
      import {monitorForElements} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
      import {preventUnhandled} from '@atlaskit/pragmatic-drag-and-drop/prevent-unhandled';

      monitorForElements({
        onDragStart() {
          preventUnhandled.start();
        },
        onDrop() {
          preventUnhandled.stop();
        }
      });
  `,
  });
});
