import React from 'react';

import Button from '@atlaskit/button/new';
import { DateTimePicker } from '@atlaskit/datetime-picker';
import Form, { Field, FormFooter } from '@atlaskit/form';

const DateTimePickerFormAccessibleExample = () => (
	<Form onSubmit={(formState: unknown) => console.log('form submitted', formState)}>
		{({ formProps }) => (
			<form {...formProps}>
				<Field name="datetime-picker-accessible" label="Scheduled run time" isRequired>
					{({ fieldProps }) => (
						<DateTimePicker
							{...fieldProps}
							datePickerProps={{
								label: 'Scheduled run time, date',
								shouldShowCalendarButton: true,
							}}
							timePickerProps={{ label: 'Scheduled run time, time' }}
							clearControlLabel="Clear scheduled run time"
						/>
					)}
				</Field>
				<FormFooter>
					<Button type="submit" appearance="primary">
						Submit
					</Button>
				</FormFooter>
			</form>
		)}
	</Form>
);

export default DateTimePickerFormAccessibleExample;
