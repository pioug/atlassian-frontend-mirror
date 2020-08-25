jest.autoMockOff();

import transformer from '../5.0.0-lite-mode';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Update offset prop', () => {
  describe('offset as a string', () => {
    defineInlineTest(
      { default: transformer, parser: 'tsx' },
      {},
      `
      import { Popper } from '@atlaskit/popper';

      export default () => (
        <Popper offset='5px 8px'>
          {({ ref, style }) => (
            <div
              ref={ref}
              style={style}
            />
          )}
        </Popper>
      );
      `,
      `
      import { Popper } from '@atlaskit/popper';

      export default () => (
        <Popper offset={[5, 8]}>
          {({ ref, style }) => (
            <div
              ref={ref}
              style={style}
            />
          )}
        </Popper>
      );
      `,
      'should convert string literal to array notation',
    );

    defineInlineTest(
      { default: transformer, parser: 'tsx' },
      {},
      `
      import { Popper } from '@atlaskit/popper';

      export default () => (
        <Popper offset='5px, 8px'>
          {({ ref, style }) => (
            <div
              ref={ref}
              style={style}
            />
          )}
        </Popper>
      );
      `,
      `
      import { Popper } from '@atlaskit/popper';

      export default () => (
        <Popper offset={[5, 8]}>
          {({ ref, style }) => (
            <div
              ref={ref}
              style={style}
            />
          )}
        </Popper>
      );
      `,
      'should convert string literal to array notation - with comma',
    );
  });

  describe('offset as object expression', () => {
    defineInlineTest(
      { default: transformer, parser: 'tsx' },
      {},
      `
      import { Popper } from '@atlaskit/popper';

      export default () => (
        <Popper offset={'5px 8px'}>
          {({ ref, style }) => (
            <div
              ref={ref}
              style={style}
            />
          )}
        </Popper>
      );
      `,
      `
      import { Popper } from '@atlaskit/popper';

      export default () => (
        <Popper offset={[5, 8]}>
          {({ ref, style }) => (
            <div
              ref={ref}
              style={style}
            />
          )}
        </Popper>
      );
      `,
      `should convert object to array notation`,
    );

    defineInlineTest(
      { default: transformer, parser: 'tsx' },
      {},
      `
      import { Popper } from '@atlaskit/popper';

      function numCommaOffset() {
        return (
          <Popper offset={'5px, 8px'}>
            {({ ref, style }) => (
              <div
                ref={ref}
                style={style}
              />
            )}
          </Popper>
        );
      }
    `,
      `
      import { Popper } from '@atlaskit/popper';

      function numCommaOffset() {
        return (
          <Popper offset={[5, 8]}>
            {({ ref, style }) => (
              <div
                ref={ref}
                style={style}
              />
            )}
          </Popper>
        );
      }
      `,
      `should convert number with comma as offset`,
    );

    defineInlineTest(
      { default: transformer, parser: 'tsx' },
      {},
      `
    import { Popper } from '@atlaskit/popper';

    function numStringOffset() {
      return (
        <Popper offset={'10'}>
          {({ ref, style }) => (
            <div
              ref={ref}
              style={style}
            />
          )}
        </Popper>
      );
    }
  `,
      `
    import { Popper } from '@atlaskit/popper';

    function numStringOffset() {
      return (
        <Popper offset={[10, 0]}>
          {({ ref, style }) => (
            <div
              ref={ref}
              style={style}
            />
          )}
        </Popper>
      );
    }
    `,
      `should add default value as 0 when one offset is missing - string`,
    );

    defineInlineTest(
      { default: transformer, parser: 'tsx' },
      {},
      `
    import { Popper } from '@atlaskit/popper';

    function numOffset() {
      return (
        <Popper offset={10}>
          {({ ref, style }) => (
            <div
              ref={ref}
              style={style}
            />
          )}
        </Popper>
      );
    }
  `,
      `
    import { Popper } from '@atlaskit/popper';

    function numOffset() {
      return (
        <Popper offset={[10, 0]}>
          {({ ref, style }) => (
            <div
              ref={ref}
              style={style}
            />
          )}
        </Popper>
      );
    }
    `,
      `should add default value as 0 when one offset is missing - number`,
    );
  });

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
  import { Popper } from '@atlaskit/popper';

  export default () => (
    <Popper offset={'5px + 7vh, 8px'}>
      {({ ref, style }) => (
        <div
          ref={ref}
          style={style}
        />
      )}
    </Popper>
  );
  `,
    `
  /* TODO: (from codemod) Popper.js has been upgraded from 1.14.1 to 2.4.2,
  and as a result the offset prop has changed to be an array. e.g '0px 8px' -> [0, 8]
  Along with this change you cannot use vw, vh or % units or addition or multiplication
  Change the offset value to use pixel values
  Further details can be found in the popper docs https://popper.js.org/docs/v2/modifiers/offset/ */
  import { Popper } from '@atlaskit/popper';

  export default () => (
    <Popper offset={'5px + 7vh, 8px'}>
      {({ ref, style }) => (
        <div
          ref={ref}
          style={style}
        />
      )}
    </Popper>
  );
  `,
    `should add correct document string for vh, vw and %`,
  );

  /**
    If a user is passing in a variable for offset then we should leave a comment to
    update it themselves
  */
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import { Popper } from '@atlaskit/popper';

    function directOffset({offset}) {
      return (
        <Popper offset={offset}>
          {({ ref, style }) => (
            <div
              ref={ref}
              style={style}
            />
          )}
        </Popper>
      );
    }
    `,
    `
    /* TODO: (from codemod) Popper.js has been upgraded from 1.14.1 to 2.4.2, and as a result the offset
    prop has changed to be an array. e.g '0px 8px' -> [0, 8]
    As you are using a variable, you will have change the offset prop manually
    Further details can be found in the popper docs https://popper.js.org/docs/v2/modifiers/offset/ */
    import { Popper } from '@atlaskit/popper';

    function directOffset({offset}) {
      return (
        <Popper offset={offset}>
          {({ ref, style }) => (
            <div
              ref={ref}
              style={style}
            />
          )}
        </Popper>
      );
    }
    `,
    `should add correct document string for variable`,
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import { Manager, Popper as Popeye } from '@atlaskit/popper';

    export default () => (
      <Popeye offset={'5px 8px'}>
        {({ ref, style }) => (
          <div
            ref={ref}
            style={style}
          />
        )}
      </Popeye>
    );
    `,
    `
    import { Manager, Popper as Popeye } from '@atlaskit/popper';

    export default () => (
      <Popeye offset={[5, 8]}>
        {({ ref, style }) => (
          <div
            ref={ref}
            style={style}
          />
        )}
      </Popeye>
    );
  `,
    `should works with an aliased import and other imports`,
  );
});
