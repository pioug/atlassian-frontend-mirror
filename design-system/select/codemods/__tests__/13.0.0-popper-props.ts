jest.autoMockOff();

import transformer from '../13.0.0-popper-props';

const applyTransform = require('jscodeshift/dist/testUtils').applyTransform;

type TestArgs = {
  it: string;
  original: string;
  expected: string;
  mode?: 'only' | 'skip';
  before?: () => void;
  after?: () => void;
};

function noop() {}

function check({
  it: name,
  original,
  expected,
  before = noop,
  after = noop,
  mode = undefined,
}: TestArgs) {
  const run = mode === 'only' ? it.only : mode === 'skip' ? it.skip : it;

  run(name, () => {
    before();
    try {
      const output: string = applyTransform(
        { default: transformer, parser: 'tsx' },
        {},
        { source: original },
      );
      expect(output).toBe(expected.trim());
    } catch (e) {
      // a failed assertion will throw
      after();
      throw e;
    }
    // will only be hit if we don't throw
    after();
  });
}

/**
 PopupSelect has some changes to the values accepted by the `popperProps` prop.
 - The `positionFixed` prop has been replaced with `strategy`, which takes either `"fixed"` or `"absolute"`
*/

describe('Convert positionFixed:boolean to strategy:"fixed"|"absolute"', () => {
  check({
    it: 'Convert `positionFixed: true` to `strategy: "fixed"`',
    original: `
      import { PopupSelect } from '@atlaskit/select';

      export default () => (
        <PopupSelect
          popperProps={{
            positionFixed: true,
          }}
          options={[
            { label: 'Adelaide', value: 'adelaide' },
            { label: 'Brisbane', value: 'brisbane' }
          ]}
          placeholder='Choose a City'
          target={({ ref }) => (
            <button ref={ref}> test </button>
          )}
        />
      );
    `,
    expected: `
      import { PopupSelect } from '@atlaskit/select';

      export default () => (
        <PopupSelect
          popperProps={{
            strategy: 'fixed',
          }}
          options={[
            { label: 'Adelaide', value: 'adelaide' },
            { label: 'Brisbane', value: 'brisbane' }
          ]}
          placeholder='Choose a City'
          target={({ ref }) => (
            <button ref={ref}> test </button>
          )}
        />
      );
    `,
  });

  check({
    it: 'Convert `positionFixed: {something truthy}` to `strategy: "fixed"`',
    original: `
      import { PopupSelect } from '@atlaskit/select';

      export default () => (
        <PopupSelect
          popperProps={{
            positionFixed: "yes",
          }}
          options={[
            { label: 'Adelaide', value: 'adelaide' },
            { label: 'Brisbane', value: 'brisbane' }
          ]}
          placeholder='Choose a City'
          target={({ ref }) => (
            <button ref={ref}> test </button>
          )}
        />
      );
    `,
    expected: `
      import { PopupSelect } from '@atlaskit/select';

      export default () => (
        <PopupSelect
          popperProps={{
            strategy: 'fixed',
          }}
          options={[
            { label: 'Adelaide', value: 'adelaide' },
            { label: 'Brisbane', value: 'brisbane' }
          ]}
          placeholder='Choose a City'
          target={({ ref }) => (
            <button ref={ref}> test </button>
          )}
        />
      );
    `,
  });

  check({
    it: 'Convert `positionFixed: false` to `strategy:"absolute"`',
    original: `
      import { PopupSelect } from '@atlaskit/select';

      export default () => (
        <PopupSelect
          popperProps={{
            positionFixed: false,
          }}
          options={[
            { label: 'Adelaide', value: 'adelaide' },
            { label: 'Brisbane', value: 'brisbane' }
          ]}
          placeholder='Choose a City'
          target={({ ref }) => (
            <button ref={ref}> test </button>
          )}
        />
      );
    `,
    expected: `
      import { PopupSelect } from '@atlaskit/select';

      export default () => (
        <PopupSelect
          popperProps={{
            strategy: 'absolute',
          }}
          options={[
            { label: 'Adelaide', value: 'adelaide' },
            { label: 'Brisbane', value: 'brisbane' }
          ]}
          placeholder='Choose a City'
          target={({ ref }) => (
            <button ref={ref}> test </button>
          )}
        />
      );
    `,
  });
});

/**
 PopupSelect has some changes to the values accepted by the `popperProps` prop.
 - Modifiers have been re-written and have a very different format`
*/

describe('Warn use of the `modifiers` prop', () => {
  check({
    it:
      'should add warning comment when using the modifier prop in `popperProps`',
    original: `
      import { PopupSelect } from '@atlaskit/select';

      export default () => (
        <PopupSelect
          popperProps={{
            modifiers: {},
          }}
          options={[
            { label: 'Adelaide', value: 'adelaide' },
            { label: 'Brisbane', value: 'brisbane' }
          ]}
          placeholder='Choose a City'
          target={({ ref }) => (
            <button ref={ref}> test </button>
          )}
        />
      );
    `,
    expected: `
    /* TODO: (from codemod) Popper.js has been upgraded from 1.14.1 to 2.4.2,
      and as a result the modifier prop has changed significantly. The format has been
      changed from object of objects, to array of objects, with the key for each modifier
      replaced with a name key:value pair inside the modifier object, and an options:object
      pair for configuration and other changes unique to each modifier.
      Further details can be found in the popper docs: https://popper.js.org/docs/v2/modifiers/ */
      import { PopupSelect } from '@atlaskit/select';

      export default () => (
        <PopupSelect
          popperProps={{
            modifiers: {},
          }}
          options={[
            { label: 'Adelaide', value: 'adelaide' },
            { label: 'Brisbane', value: 'brisbane' }
          ]}
          placeholder='Choose a City'
          target={({ ref }) => (
            <button ref={ref}> test </button>
          )}
        />
      );
    `,
  });
});
