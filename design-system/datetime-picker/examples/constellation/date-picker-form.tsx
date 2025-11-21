import React from 'react';

import Button from '@atlaskit/button/new';
import { DatePicker } from '@atlaskit/datetime-picker';
import Form, { Field, FormFooter, HelperMessage } from '@atlaskit/form';

const DatePickerFormExample = (): React.JSX.Element => (
	<Form onSubmit={(formState: unknown) => console.log('form submitted', formState)}>
		<Field name="datepicker-form" label="Start date" isRequired={false} defaultValue="">
			{({ fieldProps }) => (
				<>
					<DatePicker
						{...fieldProps}
						clearControlLabel="Clear start date"
						shouldShowCalendarButton
						inputLabel="Start date"
						openCalendarLabel="open calendar"
					/>
					<HelperMessage>Help or instruction text goes here</HelperMessage>
				</>
			)}
		</Field>
		<FormFooter>
			<Button type="submit" appearance="primary">
				Submit
			</Button>
		</FormFooter>
	</Form>
);

export default DatePickerFormExample;
