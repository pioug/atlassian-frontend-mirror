import { SerializedStyles } from '@emotion/react';

import { Breakpoint } from '../../constants';

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

export type BreakpointIndexedStyle = Record<
  Breakpoint | 'static',
  SerializedStyles
>;

export type GenericPropertyValue =
  | string
  | Partial<Record<Breakpoint, string>>
  | undefined;
