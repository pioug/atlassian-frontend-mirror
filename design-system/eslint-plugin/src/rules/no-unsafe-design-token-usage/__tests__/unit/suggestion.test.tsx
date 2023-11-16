import { tester } from '../../../__tests__/utils/_tester';
import rule from '../../index';

tester.run('no-unsafe-design-token-usage', rule, {
  valid: [],
  invalid: [
    {
      code: `css({ boxShadow: token('color.text.danger', '#000') })`,
      output: `css({ boxShadow: token('color.text.danger') })`,
      errors: [
        {
          messageId: 'tokenFallbackRestricted',
        },
      ],
    },
  ],
});
