jest.autoMockOff();

import { check } from './_framework';

import transformer from '../upgrade-pragmatic-drag-and-drop-to-stable';

describe('ElementMonitorCanMonitorArgs => ElementMonitorGetFeedbackArgs', () => {
  check({
    transformer,
    it: 'should transform named imports',
    original: `
      import {ElementMonitorCanMonitorArgs} from '@atlaskit/pragmatic-drag-and-drop/adapter/element';

      function canMonitor(args: ElementMonitorCanMonitorArgs): boolean {
        return true;
      }
    `,
    expected: `
      import {ElementMonitorGetFeedbackArgs} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

      function canMonitor(args: ElementMonitorGetFeedbackArgs): boolean {
        return true;
      }
    `,
  });
  check({
    transformer,
    it: 'should transform type imports',
    original: `
      import type { ElementMonitorCanMonitorArgs } from '@atlaskit/pragmatic-drag-and-drop/adapter/element';
    `,
    expected: `
      import type { ElementMonitorGetFeedbackArgs } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
    `,
  });
});
