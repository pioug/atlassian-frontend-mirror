import React from 'react';

import Button from '@atlaskit/button/new';
import { DateTimePicker } from '@atlaskit/datetime-picker';
import Form, { Field, FormFooter } from '@atlaskit/form';

const DateTimePickerFormExample = (): React.JSX.Element => (
	<Form onSubmit={(formState: unknown) => console.log('form submitted', formState)}>
		<Field
			name="datetime-picker"
			label="Scheduled run time"
			isRequired={false}
			helperMessage="Help or instruction text goes here."
			component={({ fieldProps }) => (
				<DateTimePicker
					{...fieldProps}
					clearControlLabel="Clear scheduled run time"
					datePickerProps={{
						shouldShowCalendarButton: true,
						label: 'Scheduled run time, date',
					}}
					timePickerProps={{ label: 'Scheduled run time, time' }}
				/>
			)}
		/>
		<FormFooter>
			<Button type="submit" appearance="primary">
				Submit
			</Button>
		</FormFooter>
	</Form>
);

export default DateTimePickerFormExample;
