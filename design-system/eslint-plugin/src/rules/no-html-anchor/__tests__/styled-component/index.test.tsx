// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import { linesOnly } from '../../../__tests__/utils/_strings';
import rule from '../../index';

ruleTester.run('no-html-anchor', rule, {
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
        // Styled > reports for a styled.a with the correct message
        import { styled } from '@compiled/react';
        const MyAnchor = styled.a({});
        <MyAnchor>Hello, World!</MyAnchor>
      `,
			errors: [
				{
					message:
						'This <a> should be replaced with a link component from the Atlassian Design System, such as the "Link" or "LinkButton" component when suitable. For custom links use the "Anchor" primitive. ADS links include event tracking, automatic router configuration, ensure accessible implementations, and provide access to ADS styling features like design tokens.',
				},
			],
		},
		{
			code: linesOnly`
        // Styled > reports for a styled.a with a href
        import { styled } from '@compiled/react';
        const MyAnchor = styled.a({});
        <MyAnchor href="/">Hello, World!</MyAnchor>
      `,
			errors: [
				{
					messageId: 'noHtmlAnchor',
				},
			],
		},
		{
			code: linesOnly`
        // Styled > reports for a self-closing styled.a
        import { styled } from '@compiled/react';
        const MyAnchor = styled.a({});
        <MyAnchor />
      `,
			errors: [
				{
					messageId: 'noHtmlAnchor',
				},
			],
		},
		{
			code: linesOnly`
        // Styled > reports for a self-closing styled.div with role="link"
        import { styled } from '@compiled/react';
        const MyFakeLink = styled.div({
          display: 'block',
          appearance: 'none',
        });
        <MyFakeLink role="link" />
      `,
			errors: [
				{
					messageId: 'noHtmlAnchor',
				},
			],
		},
		{
			code: linesOnly`
        // Styled > reports for a styled.div with role="link"
        import { styled } from '@compiled/react';
        const MyFakeLink = styled.div({
          display: 'block',
          appearance: 'none',
        });
        <MyFakeLink role="link">Hello, World!</MyFakeLink>
      `,
			errors: [
				{
					messageId: 'noHtmlAnchor',
				},
			],
		},
		{
			code: linesOnly`
        // Styled > reports for a styled.span with role="link"
        import { styled } from '@compiled/react';
        const MyFakeLink = styled.span({
          display: 'block',
          appearance: 'none',
        });
        <MyFakeLink role="link">Hello, World!</MyFakeLink>
      `,
			errors: [
				{
					messageId: 'noHtmlAnchor',
				},
			],
		},
	],
});
