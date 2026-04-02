import React from 'react';

import Button from '@atlaskit/button/new';
import { TimePicker } from '@atlaskit/datetime-picker';
import Form, { Field, FormFooter } from '@atlaskit/form';

const TimePickerFormExample = (): React.JSX.Element => (
	<Form onSubmit={(formState: unknown) => console.log('form submitted', formState)}>
		<Field
			name="time-picker"
			label="Scheduled run time"
			isRequired={false}
			helperMessage="Help or instruction text goes here."
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

export default TimePickerFormExample;
