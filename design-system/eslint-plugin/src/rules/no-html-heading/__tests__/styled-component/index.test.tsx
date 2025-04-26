// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import { linesOnly } from '../../../__tests__/utils/_strings';
import rule from '../../index';

ruleTester.run('no-html-heading', rule, {
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
        // Styled > reports for a styled.h2 with the correct message
        import { styled } from '@compiled/react';
        const MyHeading = styled.h2({});
        <MyHeading>Hello, World!</MyHeading>
      `,
			errors: [
				{
					message:
						'This <h2> should be replaced with a heading component from the Atlassian Design System. ADS headings include ensure accessible implementations and provide access to ADS styling features like design tokens.',
				},
			],
		},
		{
			code: linesOnly`
        // Styled > reports for a self-closing styled.h3
        import { styled } from '@compiled/react';
        const MyHeading = styled.h3({});
        <MyHeading />
      `,
			errors: [
				{
					messageId: 'noHtmlHeading',
				},
			],
		},
		{
			code: linesOnly`
        // Styled > reports for a self-closing styled.div with role="heading"
        import { styled } from '@compiled/react';
        const MyFakeHeading = styled.div({
          display: 'block',
          appearance: 'none',
        });
        <MyFakeHeading role="heading" />
      `,
			errors: [
				{
					messageId: 'noHtmlHeading',
				},
			],
		},
		{
			code: linesOnly`
        // Styled > reports for a styled.div with role="heading"
        import { styled } from '@compiled/react';
        const MyFakeHeading = styled.div({
          display: 'block',
          appearance: 'none',
        });
        <MyFakeHeading role="heading">Hello, World!</MyFakeHeading>
      `,
			errors: [
				{
					messageId: 'noHtmlHeading',
				},
			],
		},
		{
			code: linesOnly`
        // Styled > reports for a styled.span with role="heading"
        import { styled } from '@compiled/react';
        const MyFakeHeading = styled.span({
          display: 'block',
          appearance: 'none',
        });
        <MyFakeHeading role="heading">Hello, World!</MyFakeHeading>
      `,
			errors: [
				{
					messageId: 'noHtmlHeading',
				},
			],
		},
	],
});
