import React, { type ChangeEvent, Fragment, useState } from 'react';

import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import Form, { CheckboxField, FormFooter } from '@atlaskit/form';

const CheckboxRequiredExample = (): React.JSX.Element => {
	const [isChecked, setIsChecked] = useState(false);

	return (
		<Form onSubmit={(formData) => console.log('form data', formData)}>
			<CheckboxField name="checkbox-required" isRequired>
				{({ fieldProps }) => {
					// Define event handler that handles both controlled component state and form state updates
					const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
						// With a controlled component, we need to update the local state
						// to ensure the checkbox is updated in the UI
						setIsChecked((current) => !current);
						// Also update form state for validation and submission
						fieldProps.onChange(event);
					};

					return (
						<Fragment>
							<Checkbox
								{...fieldProps}
								label="By checking this box you agree to the terms and conditions"
								isChecked={isChecked}
								onChange={handleChange}
							/>
						</Fragment>
					);
				}}
			</CheckboxField>
			<FormFooter>
				<Button type="submit">Submit</Button>
			</FormFooter>
		</Form>
	);
};

export default CheckboxRequiredExample;
