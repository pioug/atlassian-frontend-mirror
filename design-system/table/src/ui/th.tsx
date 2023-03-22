import React, { FC } from 'react';

import { BaseCell, BaseCellProps, SortDirection } from './base-cell';

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
}) => (
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
  <BaseCell
    as="th"
    testId={testId}
    align={align}
    scope={scope}
    width={width}
    backgroundColor={backgroundColor}
    sortDirection={sortDirection}
  >
    {children}
  </BaseCell>
);
