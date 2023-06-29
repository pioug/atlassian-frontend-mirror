import { tester, typescriptEslintTester } from '../../__tests__/utils/_tester';
import rule from '../../ensure-design-token-usage-preview';
import { spacingTests } from '../../ensure-design-token-usage/__tests__/spacing.test';

typescriptEslintTester.run(
  'ensure-design-token-usage/preview',
  // @ts-expect-error
  rule,
  spacingTests,
);
tester.run('ensure-design-token-usage/preview', rule, spacingTests);
