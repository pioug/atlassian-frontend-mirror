// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import { linesOnly } from '../../../__tests__/utils/_strings';
import rule from '../../index';

ruleTester.run('no-html-textarea', rule, {
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
        // Styled > reports for a styled.textarea with the correct message
        import { styled } from '@compiled/react';
        const MyTextarea = styled.textarea({});
        <MyTextarea>Test</MyTextarea>
      `,
			errors: [
				{
					message:
						'Replace <textarea> with Textarea from @atlaskit/textarea/text-area. Preserve the field name, value, change handler and label association; use the supported sizing props for its intended height.',
				},
			],
		},
	],
});
