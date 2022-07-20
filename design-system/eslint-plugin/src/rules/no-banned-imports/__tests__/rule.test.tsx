import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';
import { restrictedPaths } from '../paths';

tester.run('no-banned-imports', rule, {
  valid: [
    {
      code: `import foo from 'foo';`,
    },
    {
      code: `import Table from '@atlaskit/table'`,
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
