// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import { linesOnly } from '../../../__tests__/utils/_strings';
import rule from '../../index';

ruleTester.run('no-html-select', rule, {
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
        // Styled > reports for a styled.select with the correct message
        import { styled } from '@compiled/react';
        const MySelect = styled.select({});
        <MySelect />
      `,
			errors: [
				{
					message:
						'This <select> should be replaced with the select component from the Atlassian Design System. ADS select components have event tracking, ensure accessible implementations, and provide access to ADS styling features like design tokens.',
				},
			],
		},
		{
			code: linesOnly`
        // Styled > reports for a styled.select with a src
        import { styled } from '@compiled/react';
        const MySelect = styled.select({});
        <MySelect><option value="test">Test</option></MySelect>
      `,
			errors: [
				{
					messageId: 'noHtmlSelect',
				},
			],
		},
	],
});
