import { ComponentType } from 'react';

import type { GlyphProps } from '@atlaskit/icon';

export interface Icon {
  defaultLabel: string;
  icon: ComponentType<GlyphProps>;
}

export type IconAppearanceMap = Record<IconAppearance, Icon>;

export type IconAppearance =
  | 'connectivity'
  | 'confirmation'
  | 'info'
  | 'warning'
  | 'error';

// cannot import from flow types, should be removed after InlineDialog conversion
export type InlineDialogPlacement =
  | 'auto-start'
  | 'auto'
  | 'auto-end'
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'right-start'
  | 'right'
  | 'right-end'
  | 'bottom-end'
  | 'bottom'
  | 'bottom-start'
  | 'left-end'
  | 'left'
  | 'left-start';
