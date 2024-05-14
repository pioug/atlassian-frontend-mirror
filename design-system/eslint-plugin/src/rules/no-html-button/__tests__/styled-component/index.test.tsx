// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import { linesOnly } from '../../../__tests__/utils/_strings';
import rule from '../../index';

ruleTester.run('no-html-button', rule, {
  valid: [
    `
      // Styled > ignores divs
      import { styled } from '@compiled/react';
      const MyContainer = styled.div({ padding: '8px' });
      <MyContainer>Hello, World!</MyContainer>
    `,
    `
      // Styled > ignores React components
      import { styled } from '@compiled/react';
      const MyStyledButton = styled.Button({ padding: '8px' });
      <MyStyledButton>Hello, World!</MyStyledButton>
    `,
    `
      // Styled > ignores standard inputs
      import { styled } from '@compiled/react';
      const MyInput = styled.input({ padding: '8px' });
      <MyInput>Hello, World!</MyInput>
    `,
    `
      // Styled > ignores text inputs
      import { styled } from '@compiled/react';
      const MyInput = styled.input({ padding: '8px' });
      <MyInput type="text">Hello, World!</MyInput>
    `,
  ],
  invalid: [
    {
      code: linesOnly`
        // Styled > reports for a styled.button with the correct message
        import { styled } from '@compiled/react';
        const MyButton = styled.button({});
        <MyButton>Hello, World!</MyButton>
      `,
      errors: [
        {
          message:
            'This button should be replaced with a button component from the Atlassian Design System, such as the "Button" component when suitable. For custom buttons use the "Pressable" primitive. ADS buttons include event tracking, ensure accessible implementations, and provide access to ADS styling features like design tokens.',
        },
      ],
    },
    {
      code: linesOnly`
        // Styled > reports for a self-closing styled.div with role="button"
        import { styled } from '@compiled/react';
        const MyButton = styled.div({
          display: 'block',
          appearance: 'none',
        });
        <MyButton role="button" />
      `,
      errors: [
        {
          messageId: 'noHtmlButton',
        },
      ],
    },
    {
      code: linesOnly`
        // Styled > reports for a styled.div with role="button"
        import { styled } from '@compiled/react';
        const MyButton = styled.div({
          display: 'block',
          appearance: 'none',
        });
        <MyButton role="button">Hello, World!</MyButton>
      `,
      errors: [
        {
          messageId: 'noHtmlButton',
        },
      ],
    },
    {
      code: linesOnly`
        // Styled > reports for a styled.span with role="button"
        import { styled } from '@compiled/react';
        const MyButton = styled.span({
          display: 'block',
          appearance: 'none',
        });
        <MyButton role="button">Hello, World!</MyButton>
      `,
      errors: [
        {
          messageId: 'noHtmlButton',
        },
      ],
    },
    {
      code: linesOnly`
        // Styled > reports for a styled.input with type="button"
        import { styled } from '@compiled/react';
        const MyButton = styled.input({
          display: 'block',
          appearance: 'none',
        });
        <MyButton type="button" value="Hello, World!" />
      `,
      errors: [
        {
          messageId: 'noHtmlButton',
        },
      ],
    },
    {
      code: linesOnly`
        // Styled > reports for a styled.input with type="submit"
        import { styled } from '@compiled/react';
        const MyButton = styled.input({
          display: 'block',
          appearance: 'none',
        });
        <MyButton type="submit" value="Hello, World!" />
      `,
      errors: [
        {
          messageId: 'noHtmlButton',
        },
      ],
    },
    {
      code: linesOnly`
        // Styled > reports for a styled.input with type="reset"
        import { styled } from '@compiled/react';
        const MyButton = styled.input({
          display: 'block',
          appearance: 'none',
        });
        <MyButton type="reset" value="Hello, World!" />
      `,
      errors: [
        {
          messageId: 'noHtmlButton',
        },
      ],
    },
    {
      code: linesOnly`
        // Styled > reports for a styled.input with type="image"
        import { styled } from '@compiled/react';
        const MyButton = styled.input({
          display: 'block',
          appearance: 'none',
        });
        <MyButton type="image" value="Hello, World!" />
      `,
      errors: [
        {
          messageId: 'noHtmlButton',
        },
      ],
    },
    {
      code: linesOnly`
        // Styled > reports for a styled.input with a variable value
        import { styled } from '@compiled/react';
        const MyButton = styled.input({
          display: 'block',
          appearance: 'none',
        });
        const someVar = "Hello, World!";
        <MyButton type="image" value={someVar} />
      `,
      errors: [
        {
          messageId: 'noHtmlButton',
        },
      ],
    },
  ],
});
