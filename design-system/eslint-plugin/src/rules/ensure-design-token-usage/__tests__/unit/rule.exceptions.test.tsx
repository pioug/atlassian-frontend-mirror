import { tester } from '../../../__tests__/utils/_tester';
import rule from '../../index';

tester.run('ensure-design-token-usage', rule, {
  valid: [
    {
      options: [{ exceptions: ['green'] }],
      code: `css({ color: 'green' });`,
    },
    {
      options: [{ exceptions: ['P100'] }],
      code: `css({ color: P100 });`,
    },
    {
      options: [{ exceptions: ['dangerouslyGetComputedToken'] }],
      code: `css({ color: dangerouslyGetComputedToken('foo') });`,
    },
    {
      options: [{ exceptions: ['P100'] }],
      code: `css({ color: P100 });`,
    },
    {
      options: [{ exceptions: ['P100'] }],
      code: `css({ color: P100 });`,
    },
    {
      options: [{ exceptions: ['red'] }],
      code: `<div color="red"></div>`,
    },
    {
      options: [{ exceptions: ['red', 'gold'] }],
      code: `<div color="gold" fill="red"></div>`,
    },
    {
      options: [{ exceptions: ['myCustomColor'] }],
      code: `<div color={myCustomColor}></div>`,
    },
  ],
  invalid: [
    {
      options: [{ exceptions: [] }],
      code: `css({ color: P100 });`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      options: [{ exceptions: ['red', 'gold'] }],
      code: `<div color="blue"></div>`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      options: [{ exceptions: [] }],
      code: `<div color={blue}></div>`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
  ],
});
