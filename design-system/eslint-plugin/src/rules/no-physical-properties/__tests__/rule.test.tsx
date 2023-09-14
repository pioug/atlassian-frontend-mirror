import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-physical-properties', rule, {
  valid: [
    { code: `const styles = css({ padding: '8px' })` },
    { code: `const styles = css({ paddingInlineStart: '8px' })` },
    { code: `const styles = css({ inset: '8px' })` },
    { code: `const styles = css({ textAlign: 'start' })` },
  ],
  invalid: ['css', 'xcss'].flatMap((style) => [
    {
      code: `
        ${style}({
          paddingLeft: '8px'
        })
    `,
      output: `
        ${style}({
          paddingInlineStart: '8px'
        })
    `,
      errors: [
        {
          messageId: 'noPhysicalProperties',
        },
      ],
    },
    {
      code: `
        ${style}({
          left: '8px'
        })
    `,
      output: `
        ${style}({
          insetInlineStart: '8px'
        })
    `,
      errors: [
        {
          messageId: 'noPhysicalProperties',
        },
      ],
    },
  ]),
});
