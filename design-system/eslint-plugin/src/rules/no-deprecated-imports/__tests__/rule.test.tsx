import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';
import { namedThemeExports, restrictedPaths } from '../paths';

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
    ...namedThemeExports.map(({ importName, message }) => ({
      code: `import { ${importName} } from '@atlaskit/theme';`,
      errors: [
        {
          message,
        },
      ],
    })),
    ...namedThemeExports.map(({ importName, message }) => ({
      code: `import { ${importName} as randomAlias } from '@atlaskit/theme';`,
      errors: [
        {
          message,
        },
      ],
    })),
    ...restrictedPaths
      .filter((config) => 'message' in config)
      .map(({ path, message }: any) => ({
        code: `import _ from '${path}';`,
        errors: [
          {
            message: `'${path}' import is restricted from being used. ${message}`,
          },
        ],
      })),
  ],
});
