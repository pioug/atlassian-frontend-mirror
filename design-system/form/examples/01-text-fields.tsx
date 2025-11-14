import React from 'react';

import Button from '@atlaskit/button/new';
import Form, { Field, FormFooter, FormHeader, RequiredAsterisk } from '@atlaskit/form';
import { Flex } from '@atlaskit/primitives/compiled';
import TextArea from '@atlaskit/textarea';
import TextField from '@atlaskit/textfield';

export default () => (
	<Flex direction="column">
		<Form onSubmit={(data) => console.log(data)} name="text-fields">
			<FormHeader title="Leave feedback">
				<p aria-hidden="true">
					Required fields are marked with an asterisk <RequiredAsterisk />
				</p>
			</FormHeader>
			<Field
				name="firstname"
				defaultValue=""
				label="First name"
				isRequired
				component={({ fieldProps }) => <TextField autoComplete="given-name" {...fieldProps} />}
			/>

			<Field
				name="lastname"
				defaultValue=""
				label="Last name"
				isRequired
				component={({ fieldProps: { isRequired, isDisabled, ...others } }) => (
					<TextField
						isDisabled={isDisabled}
						isRequired={isRequired}
						autoComplete="family-name"
						{...others}
					/>
				)}
			/>

			<Field<string, HTMLTextAreaElement>
				name="description"
				defaultValue=""
				label="Description"
				component={({ fieldProps }) => <TextArea {...fieldProps} />}
			/>

			<Field<string, HTMLTextAreaElement>
				name="comments"
				defaultValue=""
				label="Additional comments"
				component={({ fieldProps }) => <TextArea {...fieldProps} />}
			/>

			<FormFooter>
				<Button type="submit" appearance="primary">
					Submit
				</Button>
			</FormFooter>
		</Form>
	</Flex>
);
