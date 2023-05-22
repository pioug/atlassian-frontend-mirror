import { tester } from '../../../../__tests__/utils/_tester';
import rule from '../../index';

describe('enforce-feature-flag-usage-structure tests', () => {
  tester.run('ensure-feature-flag-registration', rule, {
    valid: [
      {
        // IfStatement
        code: `if(getBooleanFF('test-flag')) { }`,
      },
      {
        // negated IfStatement
        code: `if(!getBooleanFF('test-flag')) { }`,
      },
      {
        // ConditionalExpression
        code: `const val = getBooleanFF('test-flag') ? 'yay' : 'no';`,
      },
      {
        // LogicalExpression
        code: `const val = 100 + (getBooleanFF('test-flag') && 50 || 10);`,
      },
    ],
    invalid: [
      {
        code: `getBooleanFF('test-flag')`,
        errors: [{ messageId: 'onlyInlineIf' }],
      },
      {
        code: `const val = getBooleanFF('test-flag')`,
        errors: [{ messageId: 'onlyInlineIf' }],
      },
      {
        code: `const ff = "test-flag"; if(getBooleanFF(ff)) { }`,
        errors: [{ messageId: 'onlyStringLiteral' }],
      },
      {
        code: `if(getBooleanFF('test-flag') && getBooleanFF('test-flag')) { }`,
        errors: [
          { messageId: 'multipleFlagCheckInExpression' },
          { messageId: 'multipleFlagCheckInExpression' },
        ],
      },
      {
        code: `if(!getBooleanFF('test-flag') && !getBooleanFF('test-flag')) { }`,
        errors: [
          { messageId: 'multipleFlagCheckInExpression' },
          { messageId: 'multipleFlagCheckInExpression' },
        ],
      },
      {
        code: `if((!getBooleanFF('test-flag') || 1 == true) && getBooleanFF('test-flag')) { }`,
        errors: [
          { messageId: 'multipleFlagCheckInExpression' },
          { messageId: 'multipleFlagCheckInExpression' },
        ],
      },
    ],
  });
});
