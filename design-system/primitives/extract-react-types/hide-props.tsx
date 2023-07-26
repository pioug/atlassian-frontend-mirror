import { ReactNode } from 'react';

import { Breakpoint } from '../src/responsive/types';

type As =
  | 'article'
  | 'aside'
  | 'dialog'
  | 'div'
  | 'footer'
  | 'header'
  | 'li'
  | 'main'
  | 'nav'
  | 'ol'
  | 'section'
  | 'span'
  | 'ul';

type ResponsiveHideProps = {
  /**
   * The DOM element to render as the Box. Defaults to `div`.
   */
  as?: As;

  /**
   * Elements to be rendered inside the primitive.
   */
  children: ReactNode;

  /**
   * Apply CSS to hide this specifically **above** this breakpoint.
   * The smallest breakpoint is not included as it would always be shown and this would not be performant.
   *
   * @important do not mix `above` and `below` (TypeScript should prevent this)
   */
  above?: Exclude<Breakpoint, 'xxs'>;

  /**
   * Apply CSS to hide this specifically **below** this breakpoint.
   * The smallest breakpoint is not included as it would never be shown and this would not be performant.
   *
   * @important do not mix `above` and `below` (TypeScript should prevent this)
   */
  below?: Exclude<Breakpoint, 'xxs'>;
};

export default function Hide(_: ResponsiveHideProps) {}
