import React, { Fragment, useEffect, useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import Form, {
	ErrorMessage,
	Field,
	FormFooter,
	FormHeader,
	MessageWrapper,
	RequiredAsterisk,
	ValidMessage,
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
	selectError: 'Please select a color',
};

const formContainerStyle = cssMap({
	root: {
		width: '400px',
		maxWidth: '100%',
		margin: '0 auto',
	},
});

const { shortUsername, validUsername, usernameInUse, selectError } = errorMessages;

const checkUserName = (value: string) => {
	return userNameData.includes(value);
};

let isUsernameUsed: boolean = false;

export default function FieldLevelValidationExample() {
	const [fieldValue, setFieldValue] = useState('');
	const [fieldHasError, setFieldHasError] = useState(false);
	const [selectHasError, setSelectHasError] = useState(false);
	const [selectValue, setSelectValue] = useState<ValueType<Option>>();
	const [errorMessageText, setErrorMessageText] = useState('');
	const [messageId, setMessageId] = useState('');

	const handleSubmit = (formState: { command: string }) => {
		console.log('form state', formState);
	};

	const handleBlurEvent = () => {
		isUsernameUsed = checkUserName(fieldValue);
		if (fieldValue.length >= 5 && !isUsernameUsed) {
			setFieldHasError(false);
			setErrorMessageText('IS_VALID');
		} else {
			setFieldHasError(true);
			if (fieldValue.length <= 5) {
				setErrorMessageText('TOO_SHORT');
			} else if (isUsernameUsed) {
				setErrorMessageText('IN_USE');
			}
		}
	};

	const handleSelectBlurEvent = () => {
		selectValue ? setSelectHasError(false) : setSelectHasError(true);
	};

	useEffect(() => {
		switch (errorMessageText) {
			case 'IS_VALID':
				setMessageId('-valid');
				break;
			case 'TOO_SHORT':
			case 'IN_USE':
				setMessageId('-error');
				break;
			default:
				setMessageId('-error');
		}
	}, [errorMessageText]);

	return (
		<Flex xcss={formContainerStyle.root} direction="column">
			<Form onSubmit={handleSubmit}>
				{({ formProps }) => (
					<form {...formProps}>
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
								if (value) {
									setFieldValue(value);
								}
							}}
						>
							{({ fieldProps: { id, ...rest } }) => {
								return (
									<Fragment>
										<TextField
											{...rest}
											aria-describedby={fieldHasError ? `${id}${messageId}` : undefined}
											isInvalid={fieldHasError}
											onBlur={handleBlurEvent}
										/>
										<MessageWrapper>
											{!fieldHasError && errorMessageText === 'IS_VALID' && (
												<ValidMessage>{validUsername}</ValidMessage>
											)}
											{fieldHasError && errorMessageText === 'TOO_SHORT' && (
												<ErrorMessage>{shortUsername}</ErrorMessage>
											)}
											{fieldHasError && errorMessageText === 'IN_USE' && (
												<ErrorMessage>{usernameInUse}</ErrorMessage>
											)}
										</MessageWrapper>
									</Fragment>
								);
							}}
						</Field>
						<Field<ValueType<Option>>
							name="colors"
							label="Select a color"
							defaultValue={null}
							isRequired
							validate={(value) => {
								setSelectValue(value);
							}}
						>
							{({ fieldProps: { id, ...rest } }) => {
								return (
									<Fragment>
										<Select<Option>
											inputId={id}
											{...rest}
											options={colors}
											isClearable
											clearControlLabel="Clear color"
											isInvalid={selectHasError}
											descriptionId={selectHasError ? `${id}-error` : undefined}
											onBlur={handleSelectBlurEvent}
										/>
										<MessageWrapper>
											{selectHasError && <ErrorMessage>{selectError}</ErrorMessage>}
										</MessageWrapper>
									</Fragment>
								);
							}}
						</Field>
						<FormFooter>
							<Button type="submit">Next</Button>
						</FormFooter>
					</form>
				)}
			</Form>
		</Flex>
	);
}
