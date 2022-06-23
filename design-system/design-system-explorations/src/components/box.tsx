/** @jsx jsx */
import { ReactNode } from 'react';

import { jsx } from '@emotion/core';

interface BoxProps {
  as?: keyof JSX.IntrinsicElements;
  children: ReactNode;
}

/**
 * __Box__
 *
 * A Box {description}.
 *
 * @internal
 */
function Box({ children, as: Component = 'div' }: BoxProps) {
  return <Component>{children}</Component>;
}

export default Box;
