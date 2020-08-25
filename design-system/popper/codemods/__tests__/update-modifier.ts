jest.autoMockOff();

import transformer from '../5.0.0-lite-mode';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Changing popper usage', () => {
  // TODO this probably isn't worth including, as they still have to do some major work to
  //  re-work these modifiers.

  /** Modifiers:
    - format has been changed from object of objects, to array of objects, with the key for each
      modifier replaced with a name key:value pair inside the modifier object
    - modifier-specific options have been moved inside an options: key:value pair
    - modifier options have been changed significantly: check the popper.js docs for more info
  */
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import { Popper } from '@atlaskit/popper';

    export default () => {
      customModifiers = {flip: {enabled: true}};
      return (
        <Popper modifiers={customModifiers}>
          {({
            ref,
            style,
            outOfBoundaries,
            scheduleUpdate,
          }) => (
            <>
              {outOfBoundaries && (
                <div ref={ref} style={style} onClick={scheduleUpdate} />
              )}
            </>
          )}
        </Popper>
    )};
  `,
    `
    /* TODO: (from codemod) Popper.js has been upgraded from 1.14.1 to 2.4.2,
    and as a result the modifier prop has changed significantly. The format has been
    changed from object of objects, to array of objects, with the key for each modifier
    replaced with a name key:value pair inside the modifier object, and an options:object
    pair for configuration and other changes unique to each modifier.
    Further details can be found in the popper docs: https://popper.js.org/docs/v2/modifiers/ */
    import { Popper } from '@atlaskit/popper';

    export default () => {
      customModifiers = {flip: {enabled: true}};
      return (
        <Popper modifiers={customModifiers}>
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
      );};
  `,
  );
});
