import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';
import { restrictedPaths } from '../paths';

tester.run('no-deprecated-imports', rule, {
  valid: [
    {
      code: `import foo from 'foo';`,
    },
    {
      code: `import Table from '@atlaskit/table'`,
    },
  ],
  invalid: [
    {
      code: `import * as _ from '@atlaskit/global-navigation';`,
      errors: [{ messageId: 'pathWithCustomMessage' }],
    },
    ...restrictedPaths.map(({ name, message }) => ({
      code: `import _ from '${name}';`,
      errors: [
        {
          message: `'${name}' import is restricted from being used. ${message}`,
        },
      ],
    })),
  ],
});
