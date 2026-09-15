import React from 'react';

import Button from '@atlaskit/button/default/button';
import TimePicker from '@atlaskit/datetime-picker/time-picker';
import Form from '@atlaskit/form/form';
import Field from '@atlaskit/form/field';
import { FormFooter } from '@atlaskit/form/form-footer';

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
