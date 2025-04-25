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
        // Styled > reports for a styled.img with the correct message
        import { styled } from '@compiled/react';
        const MyImage = styled.img({});
        <MyImage />
      `,
			errors: [
				{
					message:
						'This <img> should be replaced with the image component from the Atlassian Design System. ADS images ensure accessible implementations, and provide access to ADS styling features like design tokens.',
				},
			],
		},
		{
			code: linesOnly`
        // Styled > reports for a styled.img with a src
        import { styled } from '@compiled/react';
        const MyImage = styled.img({});
        <MyImage src="foo.jpg" />
      `,
			errors: [
				{
					messageId: 'noHtmlImage',
				},
			],
		},
		{
			code: linesOnly`
        // Styled > reports for a self-closing styled.div with role="img"
        import { styled } from '@compiled/react';
        const MyFakeLink = styled.div({
          display: 'block',
          appearance: 'none',
        });
        <MyFakeLink role="img" />
      `,
			errors: [
				{
					messageId: 'noHtmlImage',
				},
			],
		},
		{
			code: linesOnly`
        // Styled > reports for a styled.div with role="img"
        import { styled } from '@compiled/react';
        const MyFakeLink = styled.div({
          display: 'block',
          appearance: 'none',
        });
        <MyFakeLink role="img">Hello, World!</MyFakeLink>
      `,
			errors: [
				{
					messageId: 'noHtmlImage',
				},
			],
		},
		{
			code: linesOnly`
        // Styled > reports for a styled.span with role="img"
        import { styled } from '@compiled/react';
        const MyFakeImage = styled.span({
          display: 'block',
          appearance: 'none',
        });
        <MyFakeImage role="img">Hello, World!</MyFakeImage>
      `,
			errors: [
				{
					messageId: 'noHtmlImage',
				},
			],
		},
	],
});
