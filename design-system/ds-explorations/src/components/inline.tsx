/** @jsx jsx */
import { Children, Fragment, ReactNode } from 'react';

import { jsx } from '@emotion/core';

import { GlobalSpacingToken } from '../constants';

import Box, { BoxProps } from './box.partial';

interface InlineProps {
  as?: 'ul' | 'ol';
  gap?: GlobalSpacingToken;
  separator?: string;
  children: ReactNode;
}

/**
 * __Inline__
 *
 * A Inline {description}.
 *
 * @internal
 */
function Inline({
  as,
  gap,
  separator,
  children,
  alignItems,
}: InlineProps & Partial<Pick<BoxProps, 'alignItems' | 'justifyContent'>>) {
  const childCount = Children.count(children);

  return (
    <Box as={as} flexDirection="row" alignItems={alignItems} gap={gap}>
      {Children.map(children, (child, index) => {
        return (
          <Fragment>
            {child}
            {separator && index !== childCount - 1 && (
              <Fragment>{separator}</Fragment>
            )}
          </Fragment>
        );
      })}
    </Box>
  );
}

export default Inline;
