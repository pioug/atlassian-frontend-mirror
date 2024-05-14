// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import { linesOnly } from '../../../__tests__/utils/_strings';
import rule from '../../index';

ruleTester.run('no-html-anchor', rule, {
  valid: [
    `
      // JSX Element > ignores React components
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: '8px' });
      <A href="/" css={paddingStyles}></A>
    `,
    `
      // JSX Element > ignores Anchor
      <Anchor href="/">Hello, World!</Anchor>
    `,
  ],
  invalid: [
    {
      code: linesOnly`
        // JSX Element > reports for an anchor element and shows correct message
        <a>Hello, World!</a>
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
        // JSX Element > reports for an anchor with href
        <a href="/">Hello, World!</a>
      `,
      errors: [
        {
          messageId: 'noHtmlAnchor',
        },
      ],
    },
    {
      code: linesOnly`
        // JSX Element > reports for a self-closing anchor
        <a />
      `,
      errors: [
        {
          messageId: 'noHtmlAnchor',
        },
      ],
    },
  ],
});
