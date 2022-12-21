/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import {
  UNSAFE_BoxProps as BoxProps,
  UNSAFE_TextProps as TextProps,
} from '@atlaskit/ds-explorations';
import {
  B100,
  B400,
  N0,
  N200,
  N30A,
  N40,
  N500,
  N700,
} from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { AppearanceTypes } from './types';

export const flagBackgroundColor: Record<
  AppearanceTypes,
  BoxProps['backgroundColor']
> = {
  error: 'danger.bold',
  info: 'neutral.bold',
  normal: 'elevation.surface.overlay',
  success: 'success.bold',
  warning: 'warning.bold',
};

export const flagIconColor: Record<AppearanceTypes, string> = {
  error: token('color.icon.inverse', N0),
  info: token('color.icon.inverse', N0),
  normal: token('color.icon.subtle', N500),
  success: token('color.icon.inverse', N0),
  warning: token('color.icon.warning.inverse', N700),
};

/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
export const flagTextColor: Record<AppearanceTypes, TextProps['color']> = {
  error: 'inverse',
  info: 'inverse',
  normal: 'subtle',
  success: 'inverse',
  warning: 'warning.inverse',
};

export const flagTextColorToken = {
  error: token('color.text.inverse', N0),
  info: token('color.text.inverse', N0),
  normal: token('color.text.subtle', N500),
  success: token('color.text.inverse', N0),
  warning: token('color.text.warning.inverse', N700),
};

export const flagFocusRingColor: Record<AppearanceTypes, string> = {
  error: token('color.border.focused', N40),
  info: token('color.border.focused', N40),
  normal: token('color.border.focused', B100),
  success: token('color.border.focused', N40),
  warning: token('color.border.focused', N200),
};

// TODO: DSP-2519 Interaction tokens should be used for hovered and pressed states
// https://product-fabric.atlassian.net/browse/DSP-2519

export const actionBackgroundColor: Record<AppearanceTypes, string> = {
  success: token('color.background.neutral', N30A),
  info: token('color.background.neutral', N30A),
  error: token('color.background.neutral', N30A),
  warning: token('color.background.neutral', N30A),
  normal: 'none',
};

export const actionTextColor: Record<AppearanceTypes, string> = {
  success: token('color.text.inverse', N0),
  info: token('color.text.inverse', N0),
  error: token('color.text.inverse', N0),
  warning: token('color.text.warning.inverse', N700),
  normal: token('color.link', B400),
};
