import React from 'react';

import Form, { Field } from '@atlaskit/form';
import Select from '@atlaskit/select';

import { cities } from '../common/data';

const validate = (value: any) => (!value ? 'This field is required.' : undefined);

interface FormData {
	'fail-city': string;
	'success-city': string;
}

const ValidationExample = (): React.JSX.Element => (
	<Form onSubmit={(data: FormData) => console.log(data)}>
		<Field
			label="City"
			name="fail-city"
			validate={validate}
			helperMessage="Trigger a validation error by focusing on this field and pressing tab."
			component={({ fieldProps }: any) => <Select {...fieldProps} options={cities} />}
		/>
		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
		<hr role="presentation" style={{ border: 0, margin: '1em 0' }} />
		<Field
			label="City"
			id="success"
			name="success-city"
			defaultValue={cities[0]}
			validate={validate}
			component={({ fieldProps }: any) => <Select {...fieldProps} options={cities} />}
		></Field>
	</Form>
);

export default ValidationExample;
