import React, { Component, Fragment } from 'react';

import Button from '@atlaskit/button/default/button';
import { Checkbox } from '@atlaskit/checkbox/checkbox';
import FlagGroup from '@atlaskit/flag/flag-group';
import { CheckboxField } from '@atlaskit/form/CheckboxField';
import Field from '@atlaskit/form/Field';
import { ErrorMessage } from '@atlaskit/form/error-message';
import { HelperMessage } from '@atlaskit/form/helper-message';
import { MessageWrapper } from '@atlaskit/form/message-wrapper';
import Link from '@atlaskit/link/link';
import SectionMessage from '@atlaskit/section-message/message';
import Select from '@atlaskit/select/default';
import TextArea from '@atlaskit/textarea/text-area';
import Textfield from '@atlaskit/textfield/text-field';

import FeedbackCollector, { FeedbackFlag } from '../src';

interface State {
	isOpen: boolean;
	displayFlag: boolean;
}

const ENTRYPOINT_ID: string = 'your_entrypoint_id';
const name: string = 'Feedback Sender';

const validateSelectComponent = (value: any) => {
	if (!value) {
		return 'SELECT_COMPONENT_EMPTY';
	}
	return undefined;
};

const validateSummary = (value: any) => {
	if (!value) {
		return undefined;
	}
	if (value.trim() === '') {
		return 'SUMMARY_EMPTY';
	}
	return undefined;
};

const FormContent = (
	<Fragment>
		<Field name="summary" label="Summary" isRequired validate={validateSummary}>
			{({ fieldProps, error }) => (
				<Fragment>
					<Textfield autoComplete="off" {...fieldProps} />
					<MessageWrapper>
						{error === 'SUMMARY_EMPTY' && <ErrorMessage>Summary is invalid.</ErrorMessage>}
					</MessageWrapper>
				</Fragment>
			)}
		</Field>
		<Field label="Components" name="components" isRequired validate={validateSelectComponent}>
			{({ fieldProps, error }) => (
				<Fragment>
					<Select {...fieldProps} />
					<MessageWrapper>
						<HelperMessage>
							Start typing to get a list of possible matches or press down to select.
						</HelperMessage>
						{error === 'SELECT_COMPONENT_EMPTY' && (
							<ErrorMessage>Please select a component.</ErrorMessage>
						)}
					</MessageWrapper>
				</Fragment>
			)}
		</Field>
		<Field label="Description" name="description">
			{({ fieldProps }) => (
				<Fragment>
					<TextArea minimumRows={4} resize="auto" />
					<MessageWrapper>
						<HelperMessage>
							Please include a full description of how to replicate the problem you are
							experiencing. This may be the steps to replicate, or the data that caused the problem.
						</HelperMessage>
					</MessageWrapper>
				</Fragment>
			)}
		</Field>
		<CheckboxField name="includeUserData">
			{({ fieldProps }) => (
				<Checkbox
					{...fieldProps}
					label="Include data about your current environment, like the browser and page URL. This helps us understand your feedback better."
				/>
			)}
		</CheckboxField>
	</Fragment>
);

const WarningContent = () => (
	<SectionMessage appearance="warning">
		<p>
			<strong>Did you find a critical regression?</strong>
		</p>
		<span>
			Please check{' '}
			<Link href="https://ops.internal.atlassian.com/jira/issues/?filter=16189" target="_blank">
				currently open incidents
			</Link>{' '}
			and raise a ticket at{' '}
			<Link href="http://go.atlassian.com/incident" target="_blank">
				go/incident
			</Link>
			.
		</span>
		<p>
			<strong>Are you logged in to Jira?</strong>
		</p>
		<span>
			For the best results, make sure you are logged into{' '}
			<Link href="https://jira.atlassian.com/browse" target="_blank">
				JAC
			</Link>{' '}
			before launching this form.
		</span>
		<p>
			<Link
				href="https://hello.atlassian.net/wiki/spaces/CONF/blog/2019/04/03/430286923/What+happened+to+Hello+Confluence+feedback+collector"
				target="_blank"
			>
				Learn more about how your feedback is triaged.
			</Link>
		</p>
	</SectionMessage>
);

class DisplayFeedback extends Component<{}, State> {
	state = { isOpen: false, displayFlag: false };

	open = () => this.setState({ isOpen: true });

	close = () => this.setState({ isOpen: false });

	displayFlag = () => this.setState({ displayFlag: true });

	hideFlag = () => this.setState({ displayFlag: false });

	render() {
		const { isOpen, displayFlag } = this.state;
		return (
			<div>
				<Button appearance="primary" onClick={this.open}>
					Display Custom Feedback
				</Button>

				{isOpen && (
					<FeedbackCollector
						locale={'en'}
						customContent={
							<>
								<WarningContent />
								{FormContent}
							</>
						}
						onClose={this.close}
						onSubmit={this.displayFlag}
						name={name}
						entrypointId={ENTRYPOINT_ID}
						feedbackTitle="Give feedback"
						showTypeField={false}
						showDefaultTextFields={false}
						cancelButtonLabel="Cancel"
						submitButtonLabel="Submit"
					/>
				)}

				{displayFlag && (
					<FlagGroup onDismissed={this.hideFlag}>
						<FeedbackFlag description="Flag Description" title="Flag Title" />
					</FlagGroup>
				)}
			</div>
		);
	}
}

export default (): React.JSX.Element => <DisplayFeedback />;
