import { ElementType, ReactNode } from 'react';

import type {
  AlignBlock,
  AlignInline,
  BasePrimitiveProps,
  Grow,
  Spread,
} from '../src/components/types';

type Space =
  | 'space.0'
  | 'space.025'
  | 'space.050'
  | 'space.075'
  | 'space.100'
  | 'space.150'
  | 'space.200'
  | 'space.250'
  | 'space.300'
  | 'space.400'
  | 'space.500'
  | 'space.600'
  | 'space.800'
  | 'space.1000';

type InlineProps<T extends ElementType = 'div'> = {
  /**
   * The DOM element to render as the Inline. Defaults to `div`.
   */
  as?: 'div' | 'span' | 'ul' | 'ol';
  /**
   * Used to align children along the main axis.
   */
  alignBlock?: AlignBlock;

  /**
   * Used to align children along the cross axis.
   */
  alignInline?: AlignInline;

  /**
   * Used to set whether children are forced onto one line or will wrap onto multiple lines.
   */
  shouldWrap?: boolean;

  /**
   * Used to distribute the children along the main axis.
   */
  spread?: Spread;

  /**
   * Used to set whether the container should grow to fill the available space.
   */
  grow?: Grow;

  /**
   * Represents the space between each child.
   */
  space?: Space;

  /**
   * Represents the space between rows when content wraps.
   * Used to override the `space` value in between rows.
   */
  rowSpace?: Space;

  /**
   * Renders a separator string between each child.
   */
  separator?: string;

  /**
   * A unique string that appears as data attribute data-testid in the rendered code, serving as a hook for automated tests.
   */
  testId?: string;

  /**
   * Elements to be rendered inside the Inline.
   */
  children: ReactNode;

  /**
   * Forwarded ref element
   */
  ref?: React.ComponentPropsWithRef<T>['ref'];
} & BasePrimitiveProps;

export default function Inline(_: InlineProps) {}
