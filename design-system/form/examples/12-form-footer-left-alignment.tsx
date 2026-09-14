import React from 'react';

import Button from '@atlaskit/button/default/button';
import Form from '@atlaskit/form/form';
import Field from '@atlaskit/form/field';
import { FormFooter } from '@atlaskit/form/form-footer';
import { FormHeader } from '@atlaskit/form/form-header';
import { RequiredAsterisk } from '@atlaskit/form/required-asterisk';
import { Flex } from '@atlaskit/primitives/compiled';
import TextField from '@atlaskit/textfield/text-field';

export default (): React.JSX.Element => (
	<Flex direction="column">
		<Form onSubmit={(data) => console.log(data)} name="text-fields">
			<FormHeader title="Enter your name">
				<p aria-hidden="true">
					Required fields are marked with an asterisk <RequiredAsterisk />
				</p>
			</FormHeader>
			<Field
				name="firstname"
				defaultValue=""
				label="First name"
				isRequired
				component={({ fieldProps }) => <TextField {...fieldProps} />}
			/>
			<FormFooter align="start">
				<Button type="submit" appearance="primary">
					Submit
				</Button>
			</FormFooter>
		</Form>
	</Flex>
);
