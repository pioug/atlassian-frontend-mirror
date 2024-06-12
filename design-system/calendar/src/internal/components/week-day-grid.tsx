/** @jsx jsx */
import { type ReactNode } from 'react';

import { jsx } from '@emotion/react';

import { Grid } from '@atlaskit/primitives';

interface WeekDayGridProps extends React.HTMLAttributes<HTMLElement> {
	testId?: string;
	children: ReactNode;
	isHidden?: boolean;
}

/**
 * __Week day grid__
 *
 * A week day grid aligns elements in a 7 wide grid layout.
 *
 */
const WeekDayGrid = ({ testId, children, isHidden }: WeekDayGridProps) => {
	const row = (
		<Grid testId={testId} templateColumns="repeat(7, minmax(max-content, 1fr))" role="row">
			{children}
		</Grid>
	);

	return isHidden ? <div aria-hidden="true">{row}</div> : row;
};

export default WeekDayGrid;
