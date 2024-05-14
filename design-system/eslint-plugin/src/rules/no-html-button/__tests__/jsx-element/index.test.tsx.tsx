// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import { linesOnly } from '../../../__tests__/utils/_strings';
import rule from '../../index';

ruleTester.run('no-html-button', rule, {
  valid: [
    `
      // JSX Element > ignores divs
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: '8px' });
      <div css={paddingStyles}></div>
    `,
    `
      // JSX Element > ignores React components
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: '8px' });
      <Button css={paddingStyles}></Button>
    `,
    `
      // JSX Element > ignores standard inputs
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: '8px' });
      <input css={paddingStyles} />
    `,
    `
      // JSX Element > ignores text inputs
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: '8px' });
      <input type="text" css={paddingStyles} />
    `,
    `
      // JSX Element > ignores components with role="button"
      <MyButton role="button" />
    `,
  ],
  invalid: [
    {
      code: linesOnly`
        // JSX Element > reports for a button element and shows correct message
        <button>Hello, World!</button>
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
        // JSX Element > reports for an input element and shows correct message
        <input type="button" value="Hello, World!" />
      `,
      errors: [
        {
          message:
            'This input should be replaced with a button component from the Atlassian Design System, such as the "Button" component when suitable. For custom buttons use the "Pressable" primitive. ADS buttons include event tracking, ensure accessible implementations, and provide access to ADS styling features like design tokens.',
        },
      ],
    },
    {
      code: linesOnly`
        // JSX Element > reports for a self-closing div with role="button"
        <div role="button" />
      `,
      errors: [
        {
          messageId: 'noHtmlButton',
        },
      ],
    },
    {
      code: linesOnly`
        // JSX Element > reports for a div with role="button"
        <div role="button">Hello, World!</div>
      `,
      errors: [
        {
          messageId: 'noHtmlButton',
        },
      ],
    },
    {
      code: linesOnly`
        // JSX Element > reports for a span with role="button"
        <span role="button">Hello, World!</span>
      `,
      errors: [
        {
          messageId: 'noHtmlButton',
        },
      ],
    },
    {
      code: linesOnly`
        // JSX Element > reports for an anchor with role="button"
        <a role="button">Hello, World!</a>
      `,
      errors: [
        {
          messageId: 'noHtmlButton',
        },
      ],
    },
    {
      code: linesOnly`
        // JSX Element > reports for a main with role="button"
        <main role="button">Hello, World!</main>
      `,
      errors: [
        {
          messageId: 'noHtmlButton',
        },
      ],
    },
    {
      code: linesOnly`
        // JSX Element > reports for an input type="button"
        <input type="button" value="Hello, World!" />
      `,
      errors: [
        {
          messageId: 'noHtmlButton',
        },
      ],
    },
    {
      code: linesOnly`
        // JSX Element > reports for an input type="submit"
        <input type="submit" value="Hello, World!" />
      `,
      errors: [
        {
          messageId: 'noHtmlButton',
        },
      ],
    },
    {
      code: linesOnly`
        // JSX Element > reports for an input type="reset"
        <input type="reset" value="Hello, World!" />
      `,
      errors: [
        {
          messageId: 'noHtmlButton',
        },
      ],
    },
    {
      code: linesOnly`
        // JSX Element > reports for an input type="image"
        <input type="image" alt="Login" src="/media/examples/submit-button.png" />
      `,
      errors: [
        {
          messageId: 'noHtmlButton',
        },
      ],
    },
  ],
});
