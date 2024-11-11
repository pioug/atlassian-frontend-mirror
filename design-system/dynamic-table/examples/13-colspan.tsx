/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import DynamicTable from '@atlaskit/dynamic-table';

const days = ['Time', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const head = {
	cells: days.map((day) => ({
		key: day,
		content: day,
	})),
};

const rows = [
	{
		key: `morning-row`,
		cells: ['9:00', 'Math', 'History', 'Science', 'Computing', 'Math'].map((content, index) => ({
			key: index,
			content,
		})),
	},
	{
		key: 'midday-row',
		cells: [
			{
				key: 0,
				content: '12:00',
			},
			{
				key: 1,
				content: 'LUNCH',
				colSpan: 5,
			},
		],
	},
	{
		key: 'afternoon-row',
		cells: ['13:00', 'Science', 'History', 'Psychology', 'Computing', 'Business'].map(
			(content, index) => ({
				key: index,
				content,
			}),
		),
	},
];

const CustomColSpanExample = () => (
	<DynamicTable
		caption="Class timetable"
		head={head}
		rows={rows}
		loadingSpinnerSize="large"
		isLoading={false}
		isFixedSize
	/>
);

export default CustomColSpanExample;
