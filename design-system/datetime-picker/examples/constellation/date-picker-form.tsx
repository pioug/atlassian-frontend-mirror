import React from 'react';

import Button from '@atlaskit/button/default/button';
import { DatePicker } from '@atlaskit/datetime-picker';
import Form from '@atlaskit/form/form';
import Field from '@atlaskit/form/field';
import { FormFooter } from '@atlaskit/form/form-footer';

const DatePickerFormExample = (): React.JSX.Element => (
	<Form onSubmit={(formState: unknown) => console.log('form submitted', formState)}>
		<Field
			name="datepicker-form"
			label="Start date"
			isRequired={false}
			defaultValue=""
			helperMessage="Help or instruction text goes here"
			component={({ fieldProps }) => (
				<DatePicker
					{...fieldProps}
					clearControlLabel="Clear start date"
					shouldShowCalendarButton
					inputLabel="Start date"
					openCalendarLabel="open calendar"
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

export default DatePickerFormExample;
