import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-selectors-object', rule, {
  valid: [],
  invalid: [
    {
      name: 'selectors object is provided',
      code: `
        import { cssMap } from '@compiled/react';

        cssMap({
          variant: {
            selectors: {}
          }
        });
      `,
      errors: [
        {
          messageId: 'no-selectors-object',
        },
      ],
    },
  ],
});
