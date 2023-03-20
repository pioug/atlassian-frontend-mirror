import { SerializedStyles } from '@emotion/react';

import {
  ResponsiveCSSObject,
  ResponsiveObject,
} from '../../helpers/responsive';

export const BOX_RESPONSIVE_PROPS = [
  'borderWidth',
  'display',
  'padding',
  'paddingBlock',
  'paddingBlockStart',
  'paddingBlockEnd',
  'paddingInline',
  'paddingInlineStart',
  'paddingInlineEnd',
] as const;
export type BoxResponsiveProp = typeof BOX_RESPONSIVE_PROPS[number];

export type StaticResponsiveCSSObject = ResponsiveCSSObject & {
  static: SerializedStyles;
};

export type GenericPropertyValue =
  | string
  | ResponsiveObject<string>
  | undefined;
