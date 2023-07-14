import { ElementType, ReactNode } from 'react';

import { BasePrimitiveProps } from '../src/components/types';

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

type FlexProps<T extends ElementType = 'div'> = {
  /**
   * The DOM element to render as the Flex. Defaults to `div`.
   */
  as?: 'div' | 'span' | 'ul' | 'ol' | 'li';

  /**
   * Used to align children along the main axis.
   */
  justifyContent?:
    | 'start'
    | 'center'
    | 'end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'stretch';

  /**
   * Used to align children along the cross axis.
   */
  alignItems?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';

  /**
   * Represents the space between each child.
   */
  columnGap?: Space;

  /**
   * Represents the space between each child.
   */
  gap?: Space;

  /**
   * Represents the space between each child.
   */
  rowGap?: Space;

  /**
   * Represents the flex direction property of CSS flexbox.
   */
  direction?: 'row' | 'column';

  /**
   * Represents the flex wrap property of CSS flexbox.
   */
  wrap?: 'wrap' | 'nowrap';

  /**
   * Elements to be rendered inside the Flex.
   */
  children: ReactNode;

  /**
   * Forwarded ref element
   */
  ref?: React.ComponentPropsWithRef<T>['ref'];
} & BasePrimitiveProps;

export default function Flex(_: FlexProps) {}
