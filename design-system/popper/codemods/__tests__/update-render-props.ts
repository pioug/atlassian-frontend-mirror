jest.autoMockOff();

import transformer from '../5.0.0-lite-mode';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Update props', () => {
  /**
   * It should rename outOfBoundaries and scheduleUpdate props
   * Render Props:
    - `outOfBoundaries` has been replaced with `isReferenceHidden`, and is now true when the popper is hidden (i.e. by a
   scroll container)
    - `scheduleUpdate`, for async updates, has been renamed to `update`, and now returns a Promise.
  */
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import { Popper } from '@atlaskit/popper';

    export default () => (
      <Popper>
        {({
          ref,
          style,
          outOfBoundaries,
          scheduleUpdate
        }) => (
          <>
            {outOfBoundaries && (
              <div ref={ref} style={style} onClick={scheduleUpdate} />
            )}
          </>
        )}
      </Popper>
    )
  `,
    `
    import { Popper } from '@atlaskit/popper';

    export default () => (
      <Popper>
        {({
          ref,
          style,
          isReferenceHidden: outOfBoundaries,
          update: scheduleUpdate
        }) => (
          <>
            {outOfBoundaries && (
              <div ref={ref} style={style} onClick={scheduleUpdate} />
            )}
          </>
        )}
      </Popper>
    )
  `,
  );
});
