import React from 'react';

import Button from '@atlaskit/button/default/button';
import TimePicker from '@atlaskit/datetime-picker/time-picker';
import Form from '@atlaskit/form/form';
import Field from '@atlaskit/form/field';
import { FormFooter } from '@atlaskit/form/form-footer';

const validateField = (value?: string) => {
	if (!value) {
		return 'This field is required.';
	}
};

const TimePickerValidationExample = (): React.JSX.Element => (
	<Form onSubmit={(formState) => console.log('form submitted', formState)}>
		<Field
			name="datetime-picker"
			label="Scheduled run time"
			validate={validateField}
			isRequired
			helperMessage="You have entered a valid datetime."
			component={({ fieldProps }) => (
				<TimePicker clearControlLabel="Clear scheduled run time" {...fieldProps} />
			)}
		/>
		<FormFooter>
			<Button type="submit" appearance="primary">
				Submit
			</Button>
		</FormFooter>
	</Form>
);

export default TimePickerValidationExample;
