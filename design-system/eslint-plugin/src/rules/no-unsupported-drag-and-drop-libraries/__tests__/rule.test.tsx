import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';
import { restrictedPaths } from '../paths';

tester.run('no-unsupported-drag-and-drop-libraries', rule, {
  valid: [
    {
      code: `import { draggable } from '@atlaskit/pragmatic-drag-and-drop/adapter/element';`,
    },
    {
      code: `import { combine } from '@atlaskit/pragmatic-drag-and-drop/util/combine';`,
    },
  ],
  invalid: [
    ...restrictedPaths.map(({ path }) => ({
      code: `import foo from '${path}/foo';`,
      errors: [
        {
          messageId: 'path',
        },
      ],
    })),
    ...restrictedPaths.map(({ path }) => ({
      code: `import foo from '${path}';`,
      errors: [
        {
          messageId: 'path',
        },
      ],
    })),
  ],
});
