import React, { Fragment } from 'react';

import { LoadingButton as Button } from '@atlaskit/button';
import ButtonGroup from '@atlaskit/button/button-group';
import TextField from '@atlaskit/textfield';

import Form, { ErrorMessage, Field, FormFooter, HelperMessage } from '../src';

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
				return new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>
					data.username === 'error' ? { username: 'IN_USE' } : undefined,
				);
			}}
		>
			{({ formProps, submitting }) => (
				<form {...formProps}>
					<Field name="username" label="User name" isRequired defaultValue="hello">
						{({ fieldProps, error }) => (
							<Fragment>
								<TextField autoComplete="off" {...fieldProps} />
								{!error && <HelperMessage>You can use letters, numbers & periods.</HelperMessage>}
								{error && (
									<ErrorMessage>This user name is already in use, try another one.</ErrorMessage>
								)}
							</Fragment>
						)}
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
