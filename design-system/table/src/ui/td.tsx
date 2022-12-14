/** @jsx jsx */
import { FC } from 'react';

import { jsx } from '@emotion/react';

import { BaseCell, BaseCellProps } from './base-cell';

/**
 * __Cell__
 *
 * A data cell.
 *
 * @primitive
 */
export const TD: FC<Omit<BaseCellProps, 'as'>> = ({ testId, ...props }) => (
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
  <BaseCell as="td" testId={testId} {...props} />
);
