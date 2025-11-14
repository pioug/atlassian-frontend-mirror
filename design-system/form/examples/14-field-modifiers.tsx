import React from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import Form, { Field, FormFooter, FormHeader, RequiredAsterisk } from '@atlaskit/form';
import { Flex } from '@atlaskit/primitives/compiled';
import TextField from '@atlaskit/textfield';

const BASE_SLUG = 'slug';

export default () => (
	<Flex direction="column">
		<Form<{ username: string; slug: string }>
			onSubmit={(data) => {
				console.log('form data', data);
			}}
		>
			{({ formProps, submitting, setFieldValue }) => (
				<form {...formProps}>
					<FormHeader title="Create an account">
						<p aria-hidden="true">
							Required fields are marked with an asterisk <RequiredAsterisk />
						</p>
					</FormHeader>
					<Field
						name="username"
						label="Username"
						isRequired
						defaultValue=""
						component={({ fieldProps }) => (
							<TextField
								autoComplete="username"
								{...fieldProps}
								onChange={(e) => {
									// Generate a value for the slug
									const nextValue = e.currentTarget.value.toLowerCase().replace(/ /g, '-');

									// Update the value of slug
									setFieldValue('slug', `${BASE_SLUG}-${nextValue}`);

									// Trigger username onchange
									fieldProps.onChange(e);
								}}
							/>
						)}
					/>
					<Field
						name="slug"
						label="Slug"
						isDisabled
						defaultValue={BASE_SLUG}
						component={({ fieldProps }) => <TextField {...fieldProps} />}
					/>
					<FormFooter>
						<ButtonGroup label="Form submit options">
							<Button appearance="subtle">Cancel</Button>
							<Button type="submit" appearance="primary" isLoading={submitting}>
								Sign up
							</Button>
						</ButtonGroup>
					</FormFooter>
				</form>
			)}
		</Form>
	</Flex>
);
