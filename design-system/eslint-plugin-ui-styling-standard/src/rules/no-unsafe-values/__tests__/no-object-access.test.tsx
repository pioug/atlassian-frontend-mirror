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
				name: 'object indexing as value',
				code: `
          import { css } from '@compiled/react';

          const myVariable = {
            customHeight: '5px',
          };

          const styles = css({
            height: myVariable.customHeight,
          });
        `,
				errors: [{ messageId: 'no-object-access' }],
			},
			{
				name: 'object indexing as value (variant)',
				code: `
          import { css } from '@compiled/react';

          const myVariable = {
            customHeight: '5px',
          };

          const styles = css({
            height: myVariable['customHeight'],
          });
        `,
				errors: [{ messageId: 'no-object-access' }],
			},
			{
				name: 'object indexing as value (indexing through a variable)',
				code: `
          import { css } from '@compiled/react';

          const myVariable = {
            customHeight: '5px',
          };

          const otherVariable = 'customHeight';

          const styles = css({
            height: myVariable[otherVariable],
          });
        `,
				errors: [{ messageId: 'no-object-access' }],
			},
			{
				name: 'object indexing as value (indexing through a variable defined as a function)',
				code: `
          import { css } from '@compiled/react';

          const myVariable = {
            customHeight: '5px',
          };

          const otherVariable = () => 'customHeight';

          const styles = css({
            height: myVariable[otherVariable],
          });
        `,
				errors: [{ messageId: 'no-object-access' }],
			},
			{
				name: 'object indexing as value (indexing through a function directly)',
				code: `
          import { css } from '@compiled/react';

          const myVariable = {
            customHeight: '5px',
          };

          function myFunction() {
            return 'customHeight';
          }

          const styles = css({
            height: myVariable[myFunction()],
          });
        `,
				errors: [{ messageId: 'no-object-access' }],
			},
			{
				name: 'accessing prop value',
				code: `
          import { styled } from '@compiled/react';
          const styles = styled.div(
            (props) => ({ color: props.height }),
          );
        `,
				errors: [{ messageId: 'no-object-access' }],
			},
		],
	},
);
