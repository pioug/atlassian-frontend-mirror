import React, { useRef, useState } from 'react';

import Button from '@atlaskit/button/new';
import { FlagGroup } from '@atlaskit/flag';

import FeedbackCollector, { FeedbackFlag } from '../src';

const ENTRYPOINT_ID: string = 'your_entrypoint_id';
const name: string = 'Feedback Sender';
const aaid: string = 'test-aaid';

const FeedbackPreamble = () => {
	const linkToSupport = 'https://support.atlassian.com/contact/#/';

	return (
		<>
			<p>Your thoughts are valuable in helping improve our products.</p>
			<p>
				If you're looking to get help or want to report a bug,{' '}
				<a href={linkToSupport} target="_blank" rel="noopener noreferrer">
					visit our support site.
				</a>
			</p>
		</>
	);
};

const CanContactLabel = () => {
	const linkToSupport = 'https://support.atlassian.com/contact/#/';

	return (
		<p>
			Atlassian can contact me about this feedback. See our{' '}
			<a href={linkToSupport} target="_blank" rel="noopener noreferrer">
				privacy policy
			</a>
		</p>
	);
};

const EnrolLabel = () => {
	const linkToSupport = 'https://support.atlassian.com/contact/#/';

	return (
		<p>
			I'd like to help improve Atlassian products by joining the{' '}
			<a href={linkToSupport} target="_blank" rel="noopener noreferrer">
				Atlassian Research Group
			</a>
		</p>
	);
};

const DisplayFeedback = () => {
	const ref: React.MutableRefObject<HTMLElement | undefined> = useRef<HTMLElement>();

	const [isOpen, setIsOpen] = useState(false);
	const [displayFlag, setDisplayFlag] = useState(false);

	const open = () => setIsOpen(true);

	const close = () => setIsOpen(false);

	const displayFlagTrue = () => setDisplayFlag(true);

	const hideFlag = () => setDisplayFlag(false);

	return (
		<div>
			<Button appearance="primary" onClick={open}>
				Display Feedback
			</Button>

			{isOpen && (
				<FeedbackCollector
					onClose={close}
					onSubmit={displayFlagTrue}
					atlassianAccountId={aaid}
					name={name}
					entrypointId={ENTRYPOINT_ID}
					feedbackTitle="Give feedback"
					showTypeField={true}
					feedbackTitleDetails={<FeedbackPreamble />}
					canBeContactedLabel={<CanContactLabel />}
					enrolInResearchLabel={<EnrolLabel />}
					summaryPlaceholder="Let us know what's on your mind"
					cancelButtonLabel="Cancel Button Label"
					submitButtonLabel="Submit Button Label"
					feedbackGroupLabels={{
						bug: {
							fieldLabel: 'bug field label',
							selectOptionLabel: 'bug select option label',
						},
						comment: {
							fieldLabel: 'comment field label',
							selectOptionLabel: 'comment select option label',
						},
						suggestion: {
							fieldLabel: 'suggestion field label',
							selectOptionLabel: 'suggestion select option label',
						},
						question: {
							fieldLabel: 'question field label',
							selectOptionLabel: 'question select option label',
						},
						empty: {
							fieldLabel: 'empty field label',
							selectOptionLabel: 'empty select option label',
						},
					}}
					// @ts-ignore
					shouldReturnFocusRef={ref}
				/>
			)}

			{displayFlag && (
				<FlagGroup onDismissed={hideFlag}>
					<FeedbackFlag description="Flag Description" title="Flag Title" />
				</FlagGroup>
			)}
		</div>
	);
};

export default () => <DisplayFeedback />;
