import React, { Fragment } from 'react';

import Form, { ErrorMessage, Field, HelperMessage } from '@atlaskit/form';
import Select from '@atlaskit/select';

import { cities } from './common/data';

const validate = (value: any) => (!value ? 'EMPTY' : undefined);

interface FormData {
	'fail-city': string;
	'success-city': string;
}

const ValidationExample = () => (
	<Form onSubmit={(data: FormData) => console.log(data)}>
		<Field label="City" name="fail-city" validate={validate}>
			{({ fieldProps: { isInvalid, ...props }, error }: any) => (
				<Fragment>
					<Select {...props} options={cities} placeholder="Choose a City" isInvalid={isInvalid} />
					<HelperMessage>
						Trigger a validation error by focusing on this field and pressing tab.
					</HelperMessage>
					{error === 'EMPTY' && <ErrorMessage>This field is required.</ErrorMessage>}
				</Fragment>
			)}
		</Field>
		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
		<hr role="presentation" style={{ border: 0, margin: '1em 0' }} />
		<Field
			label="City"
			id="success"
			name="success-city"
			defaultValue={cities[0]}
			validate={validate}
		>
			{({ fieldProps: { isInvalid, ...props } }: any) => (
				<Select {...props} options={cities} placeholder="Choose a City" isInvalid={isInvalid} />
			)}
		</Field>

		<Field label="City Invalid" id="invalid" name="invalid-city">
			{({ fieldProps: { isInvalid, ...props } }: any) => (
				<Select {...props} options={cities} placeholder="Choose a City" isInvalid={true} />
			)}
		</Field>
	</Form>
);

export default ValidationExample;
