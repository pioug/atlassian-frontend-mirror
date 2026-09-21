import { typescriptEslintTester } from '../../__tests__/utils/_ts-tester';
import rule from '../index';

typescriptEslintTester.run(
	'no-unsafe-values',
	// @ts-expect-error
	rule,
	{
		valid: [
			{
				name: 'identifier resolves to string literal',
				code: `
          import { css } from '@compiled/react';

          const margin = '5px';
          const styles = css({
            margin
          })
				`,
			},
			{
				name: 'identifier resolves to a literal wrapped in a satisfies expression',
				code: `
          import { css } from '@compiled/react';
          import type { Height } from './types';

          const height = 56 as const satisfies Height;
          const styles = css({
            height,
          });
        `,
			},
			{
				name: 'identifier resolves to a template string with allowed values as interpolations',
				code: `
          import styled from '@emotion/styled';

          import { N30A } from '@atlaskit/theme/colors';
          import { token } from '@atlaskit/tokens';

          const borderStyle: string = \`2px solid \${token('color.border', N30A)}\`;

          export const HorizontalDivider = styled.hr({
            borderBottom: borderStyle,
          });
        `,
			},
		],
		invalid: [
			{
				name: 'undefined wrapped in a satisfies expression is blocked',
				code: `
          import { css } from '@compiled/react';

          const styles = css({
            margin: (undefined as string | undefined) satisfies string | undefined
          })
        `,
				errors: [{ messageId: 'no-variables' }],
			},
			{
				name: 'undefined is blocked',
				code: `
          import { css } from '@compiled/react';

          const styles = css({
            margin: undefined
          })
        `,
				errors: [{ messageId: 'no-variables' }],
			},
			{
				name: 'undefined is still blocked even if it has been shadowed',
				code: `
          import { css } from '@compiled/react';
          import { someBlockedValue as undefined } from 'my-package';

          const styles = css({
            margin: undefined
          })
        `,
				errors: [{ messageId: 'no-variables' }],
			},
			{
				name: 'anon function in variable as value',
				code: `
          import { css } from '@compiled/react';

          const myFunction = function() {
            return '5px';
          }

          const styles = css({
            height: myFunction,
          });
        `,
				errors: [{ messageId: 'no-variables' }],
			},
			{
				name: 'arrow function in variable as value',
				code: `
          import { css } from '@compiled/react';

          const myFunction = () => '5px';

          const styles = css({
            height: myFunction,
          });
        `,
				errors: [{ messageId: 'no-variables' }],
			},
			{
				name: 'function in variable as value',
				code: `
          import { css } from '@compiled/react';

          function myFunction() {
            return '5px';
          }

          const styles = css({
            height: myFunction,
          });
        `,
				errors: [{ messageId: 'no-variables' }],
			},
			{
				name: 'variable in array argument',
				code: `
          import { css } from '@compiled/react';

          function myFunction() {
            return '5px';
          }

          const styles = css([
            { height: myFunction },
          ]);
        `,
				errors: [{ messageId: 'no-variables' }],
			},
		],
	},
);
