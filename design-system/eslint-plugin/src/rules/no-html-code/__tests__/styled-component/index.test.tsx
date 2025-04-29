// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import { linesOnly } from '../../../__tests__/utils/_strings';
import rule from '../../index';

ruleTester.run('no-html-code', rule, {
	valid: [
		`
      // Styled > ignores React components
      import { styled } from '@compiled/react';
      const A = styled.MyComponent({ padding: '8px' });
      <A>Hello, World!</A>
    `,
		`
			// Styled > ignores React components when they aren't used
			import { styled } from '@compiled/react';
			const A = styled.MyComponent({ padding: '8px' });
		`,
	],
	invalid: [
		{
			code: linesOnly`
        // Styled > reports for a styled.code with the correct message
        import { styled } from '@compiled/react';
        const MyCode = styled.code({});
        <MyCode>Test</MyCode>
      `,
			errors: [
				{
					message:
						'This <code> should be replaced with the code component from the Atlassian Design System. The ADS code component ensures accessible implementations and consistent ADS styling.',
				},
			],
		},
	],
});
