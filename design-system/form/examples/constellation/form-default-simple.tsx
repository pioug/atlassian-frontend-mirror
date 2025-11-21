import React from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import Form, {
	CheckboxField,
	Field,
	FormFooter,
	FormHeader,
	FormSection,
	RequiredAsterisk,
} from '@atlaskit/form';
import { Flex } from '@atlaskit/primitives/compiled';
import TextField from '@atlaskit/textfield';

const FormDefaultExample = (): React.JSX.Element => (
	<Flex direction="column">
		<Form<{ schema: string; key: string; private: boolean }>
			onSubmit={(data) => {
				console.log('form data', data);
			}}
			noValidate
			name="create"
			formProps={{ 'data-attribute': 'example' }}
		>
			<FormHeader title="Create schema">
				<p aria-hidden="true">
					Required fields are marked with an asterisk <RequiredAsterisk />
				</p>
			</FormHeader>
			<FormSection>
				<Field
					name="schema"
					label="Schema name"
					defaultValue=""
					isRequired
					validate={(value) => (!value ? 'A schema name is required' : undefined)}
					component={({ fieldProps }) => <TextField {...fieldProps} />}
				/>
				<Field
					name="key"
					label="Key"
					defaultValue=""
					isRequired
					helperMessage="Create a unique key, minimum of 8 characters. Example key: IT-infrastructure"
					validMessage="Key is valid"
					component={({ fieldProps }) => <TextField autoComplete="off" {...fieldProps} />}
					validate={(value) => {
						if (!value) {
							return 'A key is required';
						}
						if (value.length < 8) {
							return 'Enter a minimum of 8 characters.';
						}
					}}
				/>
				<CheckboxField name="private">
					{({ fieldProps }) => <Checkbox {...fieldProps} label="Private schema" />}
				</CheckboxField>
			</FormSection>

			<FormFooter align="start">
				<ButtonGroup label="Form submit options">
					<Button type="submit" appearance="primary">
						Create
					</Button>
					<Button appearance="subtle">Cancel</Button>
				</ButtonGroup>
			</FormFooter>
		</Form>
	</Flex>
);

export default FormDefaultExample;
