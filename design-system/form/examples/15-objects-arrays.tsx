import React from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import TextField from '@atlaskit/textfield';

import Form, { Field, FormFooter, FormHeader, RequiredAsterisk } from '../src';

export default () => (
	<div
		style={{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			display: 'flex',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			width: '400px',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			maxWidth: '100%',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			margin: '0 auto',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			flexDirection: 'column',
		}}
	>
		<Form<{ username: string; password: string; remember: boolean }>
			onSubmit={(data) => {
				console.log('form data', data);
				return new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>
					data.username === 'error' ? { username: 'IN_USE' } : undefined,
				);
			}}
		>
			{({ formProps, submitting }) => (
				<form {...formProps}>
					<FormHeader title="Register your interest">
						<p aria-hidden="true">
							Required fields are marked with an asterisk <RequiredAsterisk />
						</p>
					</FormHeader>
					<Field
						name="username.name"
						label="User name"
						isRequired
						defaultValue="Mike Cannon-Brookes"
					>
						{({ fieldProps }) => <TextField autoComplete="username" {...fieldProps} />}
					</Field>
					<Field name="username.email" label="Email" isRequired defaultValue="mike@atlassian.com">
						{({ fieldProps }) => <TextField autoComplete="email" {...fieldProps} />}
					</Field>
					<Field name="address[0]" label="Address 1" isRequired defaultValue="">
						{({ fieldProps }) => <TextField autoComplete="address-line1" {...fieldProps} />}
					</Field>
					<Field name="address[1]" label="Address 2" isRequired defaultValue="">
						{({ fieldProps }) => <TextField autoComplete="address-line2" {...fieldProps} />}
					</Field>
					<Field name="address[2]" label="Address 3" isRequired defaultValue="">
						{({ fieldProps }) => <TextField autoComplete="address-line3" {...fieldProps} />}
					</Field>
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
	</div>
);
