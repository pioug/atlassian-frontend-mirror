/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Box, Text } from '@atlaskit/primitives/compiled';

import WeekDayGrid from './week-day-grid';

const styles = cssMap({
	columnHeader: {
		minWidth: '2.5rem',
		whiteSpace: 'nowrap',
		display: 'flex',
		justifyContent: 'center',
	},
});

interface WeekHeaderProps {
	daysShort: string[];
	testId?: string;
}

const WeekHeader: import('react').NamedExoticComponent<WeekHeaderProps> = memo<WeekHeaderProps>(
	function WeekHeader({ daysShort, testId }) {
		return (
			<WeekDayGrid isHidden testId={testId && `${testId}--column-headers`}>
				{daysShort.map((shortDay) => (
					<Box
						padding="space.100"
						xcss={styles.columnHeader}
						key={shortDay}
						role="columnheader"
						testId={testId && `${testId}--column-header`}
					>
						<Text weight="bold" size="small" align="center" color="color.text.subtle">
							{shortDay}
						</Text>
					</Box>
				))}
			</WeekDayGrid>
		);
	},
);

WeekHeader.displayName = 'WeekHeader';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default WeekHeader;
