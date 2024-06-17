/** @jsx jsx */
import type { FC } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { BaseCell, type BaseCellProps } from './base-cell';

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
