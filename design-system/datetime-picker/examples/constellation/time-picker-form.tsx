import React from 'react';

import Button from '@atlaskit/button/new';
import { TimePicker } from '@atlaskit/datetime-picker';
import Form, { Field, FormFooter, HelperMessage } from '@atlaskit/form';

const TimePickerFormExample = () => (
	<Form onSubmit={(formState: unknown) => console.log('form submitted', formState)}>
		<Field name="time-picker" label="Scheduled run time" isRequired={false}>
			{({ fieldProps }) => (
				<>
					<TimePicker clearControlLabel="Clear scheduled run time" {...fieldProps} />
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

export default TimePickerFormExample;
