import React from 'react';

import Button from '@atlaskit/button/default/button';
import Form from '@atlaskit/form/form';
import Field from '@atlaskit/form/field';
import { FormFooter } from '@atlaskit/form/form-footer';
import RadioGroup from '@atlaskit/radio/radio-group';
import { type OptionsPropType } from '@atlaskit/radio/types';

const colorItems: OptionsPropType = [
	{ name: 'color', value: 'red', label: 'Red' },
	{ name: 'color', value: 'blue', label: 'Blue' },
	{ name: 'color', value: 'yellow', label: 'Yellow' },
	{ name: 'color', value: 'green', label: 'Green' },
];

export default function RadioRequired(): React.JSX.Element {
	return (
		<Form<FormData> onSubmit={(formData) => console.log('form data', formData)}>
			<Field label="Required radio group" name="color" defaultValue="" isRequired>
				{({ fieldProps }) => <RadioGroup {...fieldProps} options={colorItems} />}
			</Field>
			<FormFooter>
				<Button type="submit">Submit</Button>
			</FormFooter>
		</Form>
	);
}
