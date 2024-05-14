import React, { type FC } from 'react';

import { BaseCell, type BaseCellProps, type SortDirection } from './base-cell';

export type THProps = Omit<BaseCellProps, 'as'>;

type InternalTHProps = THProps & { sortDirection?: SortDirection };

/**
 * __Head cell__
 *
 * A head cell.
 *
 * @primitive
 */
export const TH: FC<InternalTHProps> = ({
  children,
  testId,
  align,
  scope,
  backgroundColor,
  width,
  sortDirection,
  colSpan
}) => (
  <BaseCell
    as="th"
    testId={testId}
    align={align}
    scope={scope}
    width={width}
    backgroundColor={backgroundColor}
    sortDirection={sortDirection}
    colSpan={colSpan}
  >
    {children}
  </BaseCell>
);
