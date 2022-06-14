import path from 'path';

import testRule from '../../../../__tests__/utils/_test-rule';
import { messages, ruleName } from '../../index';

const plugin = path.resolve(__dirname, '../../../../index.tsx');

testRule({
  plugins: [plugin],
  ruleName,
  config: [false],
  accept: [
    {
      code: 'color: red;',
      description: 'should not do any checks when isEnabled is false',
    },
  ],
});

testRule({
  plugins: [plugin],
  ruleName,
  config: [true],
  accept: [
    {
      code: 'color: var(--ds-text, #000);',
      description: 'should allow hex colors as fallbacks',
    },
    {
      code: 'color: var(--ds-text, rgb(0, 0, 0));',
      description: 'should allow rgb colors as fallbacks',
    },
    {
      code: 'color: var(--ds-text, rgba(0, 0, 0, 0));',
      description: 'should allow rgba colors as fallbacks',
    },
    {
      code: 'color: var(--ds-text, rgb(--blahblah));',
      description: 'should accept rgba containing a variable as a fallback',
    },
    {
      code: 'border: 1px solid var(--ds-border-brand, blue);',
      description: 'should accept tokens in multi-part properties',
    },
    {
      code: 'border: 1px solid var(--ds-border-brand, blue);',
      description: 'should accept tokens in multi-part properties',
    },
    {
      code:
        'background: linear-gradient(var(--ds-skeleton), var(--ds-skeleton-subtle));',
      description: 'should accept tokens in linear-gradient',
    },
  ],
  reject: [
    {
      code: 'background: linear-gradient(var(--color-a), var(--color-b));',
      description: 'should now allow vars inside functions',
      warnings: [
        { message: messages.noNonTokenVars },
        { message: messages.noNonTokenVars },
      ],
    },
    {
      code: 'color: #000;',
      description: 'should not allow hex colors on their own',
      message: messages.noHardcodedColors,
    },
    {
      code: 'color: rgb(0, 0, 0);',
      description: 'should not allow rgb colors on their own',
      message: messages.noHardcodedColors,
    },
    {
      code: 'color: hsl(0, 0%, 60%);',
      description: 'should not allow hsl colors on their own',
      message: messages.noHardcodedColors,
    },
    {
      code: 'background: linear-gradient(#e66465, #9198e5);',
      description: 'should not allow raw colors inside functions',
      warnings: [
        { message: messages.noHardcodedColors },
        { message: messages.noHardcodedColors },
      ],
    },
    {
      code: 'background: linear-gradient(var(--color-a), #9198e5);',
      description: 'should not allow raw colors inside functions',
      warnings: [
        { message: messages.noNonTokenVars },
        { message: messages.noHardcodedColors },
      ],
    },
    {
      code: 'background: linear-gradient(#e66465, var(--color-b));',
      description: 'should not allow raw colors inside functions',
      warnings: [
        { message: messages.noHardcodedColors },
        { message: messages.noNonTokenVars },
      ],
    },
    {
      code: 'color: var(--adg3-color-R75);',
      description: 'should reject non-token css variables',
      message: messages.noNonTokenVars,
    },
    {
      code: 'color: rgb(var(--blahblah));',
      description: 'should reject rgb containing a variable, when on its own',
      message: messages.noHardcodedColors,
    },
    {
      code: 'color: rgba(var(--blahblah), 0.8);',
      description: 'should reject rgba containing a variable, when on its own',
      message: messages.noHardcodedColors,
    },
    {
      code: 'color: red;',
      description: 'should reject named colors',
      message: messages.noHardcodedColors,
    },
    {
      code: 'border: 1px solid blue;',
      description: 'should reject named multi-part properties',
      message: messages.noHardcodedColors,
    },
  ],
});
