/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import { token } from '@atlaskit/tokens';

import { DN40A, DN50A, DN60A, N40A, N50A, N60A } from './colors';
import themed from './utils/themed';

/**
 * __e100__
 *
 * Eg. Cards on a board.
 *
 * @deprecated use `token('elevation.shadow.raised')` instead.
 */
export const e100 = themed({
  light: `box-shadow: ${token(
    'elevation.shadow.raised',
    `0 1px 1px ${N50A}, 0 0 1px 1px ${N40A}`,
  )};`,
  dark: `box-shadow: ${token(
    'elevation.shadow.raised',
    `0 1px 1px ${DN50A}, 0 0 1px 1px ${DN40A}`,
  )};`,
});

/**
 * __e200__
 *
 * Eg. Inline dialogs.
 *
 * @deprecated use `token('elevation.shadow.overlay')` instead.
 */
export const e200 = themed({
  light: `box-shadow: ${token(
    'elevation.shadow.overlay',
    `0 4px 8px -2px ${N50A}, 0 0 1px ${N60A}`,
  )};`,
  dark: `box-shadow: ${token(
    'elevation.shadow.overlay',
    `0 4px 8px -2px ${DN50A}, 0 0 1px ${DN60A}`,
  )};`,
});

/**
 * __e300__
 *
 * Eg. Modals.
 *
 * @deprecated use `token('elevation.shadow.overlay')` instead.
 */
export const e300 = themed({
  light: `box-shadow: ${token(
    'elevation.shadow.overlay',
    `0 8px 16px -4px ${N50A}, 0 0 1px ${N60A}`,
  )};`,
  dark: `box-shadow: ${token(
    'elevation.shadow.overlay',
    `0 8px 16px -4px ${DN50A}, 0 0 1px ${DN60A}`,
  )};`,
});

/**
 * __e400__
 *
 * Eg. Panels.
 *
 * @deprecated use `token('elevation.shadow.overlay')` instead.
 */
export const e400 = themed({
  light: `box-shadow: ${token(
    'elevation.shadow.overlay',
    `0 12px 24px -6px ${N50A}, 0 0 1px ${N60A}`,
  )};`,
  dark: `box-shadow: ${token(
    'elevation.shadow.overlay',
    `0 12px 24px -6px ${DN50A}, 0 0 1px ${DN60A}`,
  )};`,
});

/**
 * __e500__
 *
 * Eg. Flags.
 *
 * @deprecated use `token('elevation.shadow.overlay')` instead.
 */
export const e500 = themed({
  light: `box-shadow: ${token(
    'elevation.shadow.overlay',
    `0 20px 32px -8px ${N50A}, 0 0 1px ${N60A}`,
  )};`,
  dark: `box-shadow: ${token(
    'elevation.shadow.overlay',
    `0 20px 32px -8px ${DN50A}, 0 0 1px ${DN60A}`,
  )};`,
});
