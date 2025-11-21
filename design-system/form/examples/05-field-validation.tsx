import React, { Fragment } from 'react';

import Button from '@atlaskit/button/new';
import Form, {
	ErrorMessage,
	Field,
	FormFooter,
	FormHeader,
	MessageWrapper,
	RequiredAsterisk,
} from '@atlaskit/form';
import { Flex, Text } from '@atlaskit/primitives/compiled';
import Select, { type ValueType } from '@atlaskit/select';
import TextField from '@atlaskit/textfield';

interface Option {
	label: string;
	value: string;
}

const colors = [
	{ label: 'blue', value: 'blue' },
	{ label: 'red', value: 'red' },
	{ label: 'purple', value: 'purple' },
	{ label: 'black', value: 'black' },
	{ label: 'white', value: 'white' },
	{ label: 'gray', value: 'gray' },
	{ label: 'yellow', value: 'yellow' },
	{ label: 'orange', value: 'orange' },
	{ label: 'teal', value: 'teal' },
];

const userNameData = ['jsmith', 'mchan'];

const errorMessages = {
	shortUsername: 'Please enter a username longer than 4 characters',
	validUsername: 'Nice one, this username is available',
	usernameInUse: 'This username is already taken, try entering another one',
	usernameIsRequired: 'A username is required.',
	selectError: 'Please select a color',
};

const checkUserName = (value: string | undefined) => {
	return value && userNameData.includes(value);
};

export default function FieldLevelValidationExample(): React.JSX.Element {
	const handleSubmit = (formState: { command: string }) => {
		console.log('form state', formState);
	};

	return (
		<Flex direction="column">
			<Form onSubmit={handleSubmit}>
				<FormHeader title="Log In">
					<Text as="p" aria-hidden={true}>
						Required fields are marked with an asterisk <RequiredAsterisk />
					</Text>
				</FormHeader>
				<Field
					name="username"
					label="Username"
					defaultValue=""
					isRequired
					validate={(value) => {
						if (!value) {
							return errorMessages.usernameIsRequired;
						} else if (value.length <= 5) {
							return errorMessages.shortUsername;
						} else if (checkUserName(value)) {
							return errorMessages.usernameInUse;
						}
					}}
					validMessage={errorMessages.validUsername}
					component={({ fieldProps }) => <TextField {...fieldProps} />}
				/>
				<Field<ValueType<Option>>
					name="colors"
					label="Select a color"
					defaultValue={null}
					isRequired
					validate={(value) => {
						if (!value) {
							return errorMessages.selectError;
						}
					}}
				>
					{({ fieldProps: { id, ...rest }, error }) => {
						return (
							<Fragment>
								<Select<Option>
									inputId={id}
									{...rest}
									options={colors}
									isClearable
									clearControlLabel="Clear color"
									descriptionId={error ? `${id}-error` : undefined}
								/>
								<MessageWrapper>{error && <ErrorMessage>{error}</ErrorMessage>}</MessageWrapper>
							</Fragment>
						);
					}}
				</Field>
				<FormFooter>
					<Button type="submit">Next</Button>
				</FormFooter>
			</Form>
		</Flex>
	);
}
