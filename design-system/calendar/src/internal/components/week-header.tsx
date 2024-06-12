/** @jsx jsx */
import { memo } from 'react';

import { jsx } from '@emotion/react';

import { Box, Text, xcss } from '@atlaskit/primitives';

import WeekDayGrid from './week-day-grid';

interface WeekHeaderProps {
	daysShort: string[];
	testId?: string;
}

const columnHeaderStyles = xcss({
	minWidth: 'size.400', // Account for languages with short week day names
	whiteSpace: 'nowrap', // Account for languages with long week day names
	display: 'flex',
	justifyContent: 'center',
});

const WeekHeader = memo<WeekHeaderProps>(function WeekHeader({ daysShort, testId }) {
	return (
		<WeekDayGrid isHidden testId={testId && `${testId}--column-headers`}>
			{daysShort.map((shortDay) => (
				<Box
					padding="space.100"
					xcss={columnHeaderStyles}
					key={shortDay}
					role="columnheader"
					testId={testId && `${testId}--column-header`}
				>
					<Text weight="bold" size="UNSAFE_small" align="center" color="color.text.subtle">
						{shortDay}
					</Text>
				</Box>
			))}
		</WeekDayGrid>
	);
});

WeekHeader.displayName = 'WeekHeader';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default WeekHeader;
