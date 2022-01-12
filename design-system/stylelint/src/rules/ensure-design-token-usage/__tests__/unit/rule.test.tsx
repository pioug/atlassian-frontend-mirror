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
      code: 'color: var(--my-color);',
      description: 'should allow vars, even when not fallbacks',
    },
    {
      code: 'background: linear-gradient(var(--color-a), var(--color-b));',
      description:
        'should allow vars inside functions, even when not fallbacks',
    },
    {
      code: 'color: var(--ds-blah, rgb(--blahblah));',
      description: 'should accept rgba containing a variable as a fallback',
    },
    {
      code: 'color: var(--ds-blah, rgb(--blahblah));',
      description: 'should accept rgba containing a variable as a fallback',
    },
  ],
  reject: [
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
      message: messages.noHardcodedColors,
    },
    {
      code: 'background: linear-gradient(#e66465, var(--color-b));',
      description: 'should not allow raw colors inside functions',
      message: messages.noHardcodedColors,
    },
    {
      code: 'color: rgb(--blahblah);',
      description: 'should reject rgb containing a variable, when on its own',
      message: messages.noHardcodedColors,
    },
    {
      code: 'color: rgb(--blahblah);',
      description: 'should reject rgba containing a variable, when on its own',
      message: messages.noHardcodedColors,
    },
  ],
});
