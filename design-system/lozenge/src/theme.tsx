/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
// TODO: DSP-1392 this file will be removed, don't import anything from this file elsewhere.
import {
  B400,
  B50,
  B500,
  G400,
  G50,
  G500,
  N0,
  N40,
  N500,
  N800,
  P400,
  P50,
  P500,
  R400,
  R50,
  R500,
  Y500,
  Y75,
} from '@atlaskit/theme/colors';

/**
 * @deprecated
 */
export const defaultBackgroundColor = {
  default: { light: N40, dark: N40 },
  inprogress: { light: B50, dark: B50 },
  moved: { light: Y75, dark: Y75 },
  new: { light: P50, dark: P50 },
  removed: { light: R50, dark: R50 },
  success: { light: G50, dark: G50 },
};

/**
 * @deprecated
 */
export const defaultTextColor = {
  default: { light: N500, dark: N500 },
  inprogress: { light: B500, dark: B500 },
  moved: { light: N800, dark: N800 },
  new: { light: P500, dark: P500 },
  removed: { light: R500, dark: R500 },
  success: { light: G500, dark: G500 },
};

/**
 * @deprecated
 */
export const boldBackgroundColor = {
  default: { light: N500, dark: N500 },
  inprogress: { light: B400, dark: B400 },
  moved: { light: Y500, dark: Y500 },
  new: { light: P400, dark: P400 },
  removed: { light: R400, dark: R400 },
  success: { light: G400, dark: G400 },
};

/**
 * @deprecated
 */
export const boldTextColor = {
  default: { light: N0, dark: N0 },
  inprogress: { light: N0, dark: N0 },
  moved: { light: N800, dark: N800 },
  new: { light: N0, dark: N0 },
  removed: { light: N0, dark: N0 },
  success: { light: N0, dark: N0 },
};

/**
 * @deprecated
 */
export type ThemeAppearance =
  | 'default'
  | 'inprogress'
  | 'moved'
  | 'new'
  | 'removed'
  | 'success';
