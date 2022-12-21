import React, { FC } from 'react';

import { BaseCell, BaseCellProps } from './base-cell';

export type THProps = Omit<BaseCellProps, 'as'>;

/**
 * __Head cell__
 *
 * A head cell.
 *
 * @primitive
 */
export const TH: FC<THProps> = ({
  children,
  testId,
  align,
  scope,
  backgroundColor,
  width,
}) => (
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
  <BaseCell
    as="th"
    testId={testId}
    align={align}
    scope={scope}
    width={width}
    backgroundColor={backgroundColor}
  >
    {children}
  </BaseCell>
);
