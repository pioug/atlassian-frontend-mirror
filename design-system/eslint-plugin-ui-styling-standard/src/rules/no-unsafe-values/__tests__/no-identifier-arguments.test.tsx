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
				name: 'passing an object through a variable',
				code: `
          import { css } from '@compiled/react';

          const myStyles = {
            height: '8px'
          };

          const styles = css(myStyles);
        `,
				errors: [{ messageId: 'no-identifier-arguments' }],
			},
			{
				name: 'passing the result of `css` through a variable',
				code: `
          import { css } from '@compiled/react';

          const myStyles = css({
            height: '8px'
          });

          const styles = css(myStyles);
        `,
				errors: [{ messageId: 'no-identifier-arguments' }],
			},
			{
				name: 'passing the result of `css` through a variable to `styled`',
				code: `
          import { styled } from '@compiled/react';

          const myStyles = css({
            height: '8px'
          });

          const Component = styled.div(myStyles)
        `,
				errors: [{ messageId: 'no-identifier-arguments' }],
			},
		],
	},
);
