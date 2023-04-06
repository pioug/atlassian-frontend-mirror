import { tester } from '../../../../__tests__/utils/_tester';
import rule from '../../index';

describe('no-invalid-storybook-decorator-usage tests', () => {
  tester.run('no-invalid-storybook-decorator-usage', rule, {
    valid: [
      {
        code: `withPlatformFeatureFlags({})(<SampleComponent/>)`,
      },
    ],
    invalid: [
      {
        code: `const flags = {'uip.sample.color': true}; withPlatformFeatureFlags(flags)(<SampleComponent/>)`,
        errors: [{ messageId: 'onlyObjectExpression' }],
      },
    ],
  });
});
