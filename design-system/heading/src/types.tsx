import { ReactNode } from 'react';

export type HeadingProps = {
  /**
   * A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests
   */
  testId?: string;
  /**
   * The text of the heading
   */
  children: ReactNode;
  /**
   * The headling level as defined by by the ADG
   */
  level:
    | 'h900'
    | 'h800'
    | 'h700'
    | 'h600'
    | 'h500'
    | 'h400'
    | 'h300'
    | 'h200'
    | 'h100';
  id?: string;
  /**
   * Allows the component to be rendered as the specified DOM Element
   */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span';
};
