import React, { Component, Fragment } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import Form, {
	ErrorMessage,
	Field,
	FormFooter,
	FormHeader,
	HelperMessage,
	MessageWrapper,
	RequiredAsterisk,
	ValidMessage,
} from '@atlaskit/form';
import { Flex, Text } from '@atlaskit/primitives/compiled';
import Select, { type ValueType } from '@atlaskit/select';
import TextField from '@atlaskit/textfield';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
interface Option {
	label: string;
	value: string;
}

const colors = [
	{ label: 'Blue', value: 'blue' },
	{ label: 'Red', value: 'red' },
	{ label: 'Purple', value: 'purple' },
	{ label: 'Black', value: 'black' },
	{ label: 'White', value: 'white' },
	{ label: 'Gray', value: 'gray' },
	{ label: 'Yellow', value: 'yellow' },
	{ label: 'Orange', value: 'orange' },
	{ label: 'Teal', value: 'teal' },
];
const formContainerStyle = cssMap({
	root: {
		width: '400px',
		maxWidth: '100%',
		margin: '0 auto',
	},
});

// eslint-disable-next-line import/no-anonymous-default-export, @repo/internal/react/no-class-components
export default class extends Component<{}> {
	getUser = async (value: string) => {
		await sleep(300);
		if (['jsmith', 'mchan'].includes(value)) {
			return 'IN_USE';
		}
		return undefined;
	};

	validate = (value?: string) => {
		if (!value) {
			return;
		}

		if (value.length < 5) {
			return 'TOO_SHORT';
		}

		return this.getUser(value);
	};

	handleSubmit = (data: { password: string }) => {
		console.log(data);
	};

	render() {
		return (
			<Flex xcss={formContainerStyle.root} direction="column">
				<Form onSubmit={this.handleSubmit}>
					{({ formProps }) => (
						<form {...formProps}>
							<FormHeader title="Register and select a color">
								<Text as="p" aria-hidden={true}>
									Required fields are marked with an asterisk <RequiredAsterisk />
								</Text>
							</FormHeader>
							<Field
								name="username"
								label="Username"
								defaultValue=""
								isRequired
								validate={this.validate}
							>
								{({ fieldProps, error, valid }) => (
									<Fragment>
										<TextField {...fieldProps} autoComplete="username" />
										<MessageWrapper>
											{!error && !valid && (
												<HelperMessage>Should be more than 4 characters</HelperMessage>
											)}
											{!error && valid && (
												<ValidMessage>Nice one, this username is available.</ValidMessage>
											)}
											{error === 'TOO_SHORT' && (
												<ErrorMessage>
													Please enter a username that's longer than 4 characters.
												</ErrorMessage>
											)}
											{error === 'IN_USE' && (
												<ErrorMessage>
													This username is already taken, please enter a different username.
												</ErrorMessage>
											)}
										</MessageWrapper>
									</Fragment>
								)}
							</Field>
							<Field<ValueType<Option>>
								name="colors"
								label="Select a color"
								defaultValue={null}
								isRequired
								validate={async (value) => {
									if (value) {
										return undefined;
									}

									return new Promise((resolve) => setTimeout(resolve, 300)).then(
										() => 'Please select a color',
									);
								}}
							>
								{({ fieldProps: { id, ...rest }, error }) => (
									<Fragment>
										<Select<Option>
											inputId={id}
											{...rest}
											options={colors}
											isClearable
											clearControlLabel="Clear color"
										/>
										<MessageWrapper>{error && <ErrorMessage>{error}</ErrorMessage>}</MessageWrapper>
									</Fragment>
								)}
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
}
