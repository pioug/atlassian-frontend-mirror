jest.autoMockOff();

import { check } from './_framework';

import transformer from '../upgrade-pragmatic-drag-and-drop-to-stable';

describe('transform auto scroller', () => {
	check({
		transformer,
		it: 'should transform imports and usage',
		original: `
      import {autoScrollForFiles} from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/file';
      import {unsafeOverflowAutoScrollForFiles} from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/unsafe-overflow/file';

      autoScrollForFiles({
        element,
      });
      unsafeOverflowAutoScrollForFiles({
        element,
      });
    `,
		expected: `
      import {autoScrollForExternal} from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/external';
      import {unsafeOverflowAutoScrollForExternal} from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/unsafe-overflow/external';

      autoScrollForExternal({
        element,
      });
      unsafeOverflowAutoScrollForExternal({
        element,
      });
  `,
	});
});
