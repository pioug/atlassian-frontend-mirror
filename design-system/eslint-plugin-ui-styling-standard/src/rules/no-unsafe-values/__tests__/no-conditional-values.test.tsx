import { typescriptEslintTester } from '../../__tests__/utils/_tester';
import rule from '../index';

typescriptEslintTester.run(
	'no-unsafe-values',
	// @ts-expect-error
	rule,
	{
		valid: [],
		invalid: [
			{
				name: 'ternary value',
				code: `
          import { css } from '@compiled/react';

          const isVisible = false;
          const styles = css({
            opacity: isVisible ? 1 : 0
          });
        `,
				errors: [{ messageId: 'no-conditional-values' }],
			},
			{
				name: 'boolean expression values',
				code: `
          import { css } from '@compiled/react';

          const isVisible = false;
          const styles = css({
            opacity: isVisible && 1
          });
        `,
				errors: [{ messageId: 'no-conditional-values' }],
			},
		],
	},
);
