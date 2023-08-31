import { type BackgroundColor, type TextColor } from '@atlaskit/primitives';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { type Appearance } from '../types';

export type ColorGroup<T extends BackgroundColor | TextColor> = {
  default: T;
  hover?: T;
  active?: T;
  disabled?: T;
  selected?: T;
};

export type ColorPreset<T extends BackgroundColor | TextColor> = {
  [key in Appearance]: ColorGroup<T>;
};

type Values = {
  background: ColorPreset<BackgroundColor>;
  color: ColorPreset<TextColor>;
};

const values: Values = {
  // Default appearance
  background: {
    default: {
      /**
       * Some colors need specific fallback colors specified
       * to match the original Button when no theme is active.
       *
       * This is because the `xcss` automatic token fallbacks use
       * the legacy themes, which do not match original colors.
       */
      // @ts-expect-error
      default: token('color.background.neutral', colors.N20A),
      hover: 'color.background.neutral.hovered',
      active: 'color.background.neutral.pressed',
      // @ts-expect-error
      disabled: token('color.background.disabled', colors.N20A),

      // @ts-expect-error
      selected: token('color.background.selected', colors.N700),
    },
    primary: {
      default: 'color.background.brand.bold',
      hover: 'color.background.brand.bold.hovered',
      active: 'color.background.brand.bold.pressed',
      // @ts-expect-error
      disabled: token('color.background.disabled', colors.N20A),
      // @ts-expect-error
      selected: token('color.background.selected', colors.N700),
    },
    warning: {
      default: 'color.background.warning.bold',
      hover: 'color.background.warning.bold.hovered',
      active: 'color.background.warning.bold.pressed',
      // @ts-expect-error
      disabled: token('color.background.disabled', colors.N20A),
      // @ts-expect-error
      selected: token('color.background.selected', colors.Y400),
    },
    danger: {
      default: 'color.background.danger.bold',
      hover: 'color.background.danger.bold.hovered',
      active: 'color.background.danger.bold.pressed',
      // @ts-expect-error
      disabled: token('color.background.disabled', colors.N20A),
      // @ts-expect-error
      selected: token('color.background.selected', colors.R500),
    },
    link: {
      default: 'color.background.neutral.subtle',
      // @ts-expect-error
      selected: token('color.background.selected', colors.N700),
    },
    subtle: {
      default: 'color.background.neutral.subtle',
      hover: 'color.background.neutral.subtle.hovered',
      active: 'color.background.neutral.subtle.pressed',
      // @ts-expect-error
      disabled: token('color.background.neutral.subtle', 'none'),
      // @ts-expect-error
      selected: token('color.background.selected', colors.N700),
    },
    'subtle-link': {
      default: 'color.background.neutral.subtle',
      // @ts-expect-error
      selected: token('color.background.selected', colors.N700),
    },
  },
  color: {
    default: {
      default: 'color.text',
      active: 'color.text',
      disabled: 'color.text.disabled',
      // @ts-expect-error
      selected: token('color.text.selected', colors.N20),
    },
    primary: {
      default: 'color.text.inverse',
      disabled: 'color.text.disabled',
      // @ts-expect-error
      selected: token('color.text.selected', colors.N20),
    },
    warning: {
      default: 'color.text.warning.inverse',
      disabled: 'color.text.disabled',
      // @ts-expect-error
      selected: token('color.text.selected', colors.N800),
    },
    danger: {
      default: 'color.text.inverse',
      disabled: 'color.text.disabled',
      // @ts-expect-error
      selected: token('color.text.selected', colors.N0),
    },
    link: {
      default: 'color.link',
      hover: 'color.link',
      active: 'color.link.pressed',
      disabled: 'color.text.disabled',
      // @ts-expect-error
      selected: token('color.text.selected', colors.N20),
    },
    subtle: {
      default: 'color.text',
      active: 'color.text',
      disabled: 'color.text.disabled',
      // @ts-expect-error
      selected: token('color.text.selected', colors.N20),
    },
    'subtle-link': {
      default: 'color.text.subtle',
      hover: 'color.text.subtle',
      active: 'color.text',
      disabled: 'color.text.disabled',
      // @ts-expect-error
      selected: token('color.text.selected', colors.N20),
    },
  },
};

export default values;
