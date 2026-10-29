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
						'Replace <select> with Select from @atlaskit/select/default. Convert option children to the options prop, adapt value/onChange to option objects, and associate the label through inputId.',
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
