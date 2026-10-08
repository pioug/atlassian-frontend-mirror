import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import DateTimePicker from '@atlaskit/datetime-picker/date-time-picker';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: {
		width: '340px',
		display: 'block',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.200'),
	},
});

export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<DateTimePicker
					defaultValue="2026-06-14T09:30:00+10:00"
					datePickerProps={{ label: 'Date' }}
					timePickerProps={{ label: 'Time' }}
				/>
			</Box>
		</IntlProvider>
	);
}
