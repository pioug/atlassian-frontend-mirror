import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-classname-prop', rule, {
  valid: [
    {
      code: `
        <div />
      `,
    },
  ],
  invalid: [
    {
      // Basic test case
      code: `
        <div className={myStyles} />
      `,
      errors: [{ messageId: 'no-classname-prop' }],
    },
    {
      // String
      code: `
        <div className="my-class" />
      `,
      errors: [{ messageId: 'no-classname-prop' }],
    },
    {
      // With non-primitive elements
      code: `
        import { styled } from '@compiled/react';

        const Component = styled.div({});

        <Component className="my-class" />
      `,
      errors: [{ messageId: 'no-classname-prop' }],
    },
  ],
});
