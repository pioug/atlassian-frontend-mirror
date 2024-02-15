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

type StackProps<T extends ElementType = 'div'> = {
  /**
   * The DOM element to render as the Stack. Defaults to `div`.
   */
  as?: 'div' | 'span' | 'ul' | 'ol';
  /**
   * Used to align children along the main axis.
   */
  alignBlock?: Exclude<AlignBlock, 'baseline'>;

  /**
   * Used to align children along the cross axis.
   */
  alignInline?: AlignInline;

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
   * A unique string that appears as data attribute data-testid in the rendered code, serving as a hook for automated tests.
   */
  testId?: string;

  /**
   * Elements to be rendered inside the Stack.
   */
  children: ReactNode;

  /**
   * Forwarded ref element
   */
  ref?: React.ComponentPropsWithRef<T>['ref'];
} & BasePrimitiveProps;

export default function Stack(_: StackProps) {}
