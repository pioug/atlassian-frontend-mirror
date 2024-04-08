import { type BackgroundColor, type TextColor } from '@atlaskit/primitives';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { type Appearance } from '../types';

export type ColorGroup<T extends BackgroundColor | TextColor> = {
  default: T;
  hover?: T;
  active?: T;
  disabled?: T;
};

export type ColorGroupWithSelected<T extends BackgroundColor | TextColor> =
  ColorGroup<T> & {
    selected?: ColorGroup<T>;
  };

export type ColorPreset<T extends BackgroundColor | TextColor> = Record<
  Appearance,
  ColorGroupWithSelected<T>
> & {
  selected: ColorGroup<T>;
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
    },
    primary: {
      default: 'color.background.brand.bold',
      hover: 'color.background.brand.bold.hovered',
      active: 'color.background.brand.bold.pressed',
      // @ts-expect-error
      disabled: token('color.background.disabled', colors.N20A),
    },
    warning: {
      default: 'color.background.warning.bold',
      hover: 'color.background.warning.bold.hovered',
      active: 'color.background.warning.bold.pressed',
      // @ts-expect-error
      disabled: token('color.background.disabled', colors.N20A),
      selected: {
        // @ts-expect-error
        default: token('color.background.selected', colors.Y400),
        // @ts-expect-error
        hover: token('color.background.selected.hovered', colors.Y400),
        // @ts-expect-error
        active: token('color.background.selected.pressed', colors.Y400),
      },
    },
    danger: {
      default: 'color.background.danger.bold',
      hover: 'color.background.danger.bold.hovered',
      active: 'color.background.danger.bold.pressed',
      // @ts-expect-error
      disabled: token('color.background.disabled', colors.N20A),
      selected: {
        // @ts-expect-error
        default: token('color.background.selected', colors.R500),
        // @ts-expect-error
        hover: token('color.background.selected.hovered', colors.R500),
        // @ts-expect-error
        active: token('color.background.selected.pressed', colors.R500),
      },
    },
    link: {
      default: 'color.background.neutral.subtle',
    },
    subtle: {
      default: 'color.background.neutral.subtle',
      hover: 'color.background.neutral.subtle.hovered',
      active: 'color.background.neutral.subtle.pressed',
      // @ts-expect-error
      disabled: token('color.background.neutral.subtle', 'none'),
    },
    'subtle-link': {
      default: 'color.background.neutral.subtle',
    },
    selected: {
      // @ts-expect-error
      default: token('color.background.selected', colors.N700),
      // @ts-expect-error
      hover: token('color.background.selected.hovered', colors.N700),
      // @ts-expect-error
      active: token('color.background.selected.pressed', colors.N700),
    },
  },
  color: {
    default: {
      // @ts-expect-error
      default: token('color.text', colors.N500),
      // @ts-expect-error
      active: token('color.text', colors.B400),
      disabled: 'color.text.disabled',
    },
    primary: {
      default: 'color.text.inverse',
      disabled: 'color.text.disabled',
    },
    warning: {
      default: 'color.text.warning.inverse',
      disabled: 'color.text.disabled',
      selected: {
        // @ts-expect-error
        default: token('color.text.selected', colors.N800),
      },
    },
    danger: {
      default: 'color.text.inverse',
      disabled: 'color.text.disabled',
      selected: {
        // @ts-expect-error
        default: token('color.text.selected', colors.N0),
      },
    },
    link: {
      default: 'color.link',
      // @ts-expect-error
      hover: token('color.link', colors.B300),
      active: 'color.link.pressed',
      disabled: 'color.text.disabled',
    },
    subtle: {
      // @ts-expect-error
      default: token('color.text', colors.N500),
      // @ts-expect-error
      active: token('color.text', colors.B400),
      disabled: 'color.text.disabled',
    },
    'subtle-link': {
      // @ts-expect-error
      default: token('color.text.subtle', colors.N200),
      // @ts-expect-error
      hover: token('color.text.subtle', colors.N90),
      // @ts-expect-error
      active: token('color.text', colors.N400),
      disabled: 'color.text.disabled',
    },
    selected: {
      // @ts-expect-error
      default: token('color.text.selected', colors.N20),
    },
  },
};

export default values;
