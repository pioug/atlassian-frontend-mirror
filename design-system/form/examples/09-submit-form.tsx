import React, { Component } from 'react';

import Button from '@atlaskit/button/new';
import TextArea from '@atlaskit/textarea';
import TextField from '@atlaskit/textfield';

import Form, { Field, FormFooter, FormHeader, RequiredAsterisk } from '../src';

interface State {
	hasSubmitted: boolean;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends Component<void, State> {
	state = {
		hasSubmitted: false,
	};

	handleSubmit = () => {
		this.setState({ hasSubmitted: true });
	};

	render() {
		const { hasSubmitted } = this.state;
		return (
			<div
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					display: 'flex',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					width: '400px',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					margin: '0 auto',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					flexDirection: 'column',
				}}
			>
				{!hasSubmitted ? (
					<Form onSubmit={this.handleSubmit}>
						{({ formProps }) => (
							<form {...formProps} name="submit-form">
								<FormHeader title="Leave feedback">
									<p aria-hidden="true">
										Required fields are marked with an asterisk <RequiredAsterisk />
									</p>
								</FormHeader>
								<Field name="name" defaultValue="" label="Name" isRequired>
									{({ fieldProps }) => <TextField autoComplete="name" {...fieldProps} />}
								</Field>

								<Field<string, HTMLTextAreaElement>
									name="description"
									defaultValue=""
									label="Description"
								>
									{({ fieldProps }) => <TextArea {...fieldProps} />}
								</Field>

								<FormFooter>
									<Button type="submit" appearance="primary">
										Submit
									</Button>
								</FormFooter>
							</form>
						)}
					</Form>
				) : (
					<div
						id="submitted"
						aria-live="polite"
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={{ padding: '30px', fontSize: '20px' }}
					>
						You have successfully submitted!
					</div>
				)}
			</div>
		);
	}
}
