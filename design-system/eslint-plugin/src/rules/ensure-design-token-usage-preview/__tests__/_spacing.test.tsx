import { tester, typescriptEslintTester } from '../../__tests__/utils/_tester';
import rule from '../../ensure-design-token-usage-preview';
import { spacingTests } from '../../ensure-design-token-usage/__tests__/spacing.test';

/**
 * This rule is deprecated and the implementation has been changed so that it never reports.
 * As such these tests will fail. The only exist to demonstrate what the rule used to achieve.
 */
typescriptEslintTester.run(
	'ensure-design-token-usage/preview',
	// @ts-expect-error
	rule,
	spacingTests,
);
tester.run('ensure-design-token-usage/preview', rule, spacingTests);
