import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { CreateForm } from '@atlaskit/link-create/create-form';
import { InlineCreate } from '@atlaskit/link-create/inline-create';
import { LinkCreateExitWarningProvider, useWithExitWarning } from '@atlaskit/link-create/exit-warning-modal';
import { TextField } from '@atlaskit/link-create/text-field';
import type { LinkCreatePlugin } from '@atlaskit/link-create/types';

function DraftForm(): React.JSX.Element {
	const [message, setMessage] = useState('');

	return (
		<CreateForm onSubmit={async () => setMessage('Example submit received; no work item was created.')}>
			<p>Edit the summary, then choose “Attempt to leave” to see the unsaved-changes warning.</p>
			<TextField name="summary" label="Summary" isRequired defaultValue="Draft that has not been saved" />
			{message && <p role="status">{message}</p>}
		</CreateForm>
	);
}

const plugin: LinkCreatePlugin = {
	group: { label: 'Work items', icon: 'issue', key: 'work-items' },
	label: 'Work item',
	icon: 'issue',
	key: 'work-item',
	form: <DraftForm />,
};

function InlineCreateWithLeaveAction(): React.JSX.Element {
	const [isEditing, setIsEditing] = useState(true);
	const [message, setMessage] = useState('');
	const leaveDraft = () => {
		setIsEditing(false);
		setMessage('Draft discarded.');
	};
	const attemptToLeave = useWithExitWarning()(leaveDraft);

	return (
		<>
			{isEditing ? (
				<>
					<Button onClick={attemptToLeave}>Attempt to leave</Button>
					<InlineCreate plugins={[plugin]} entityKey="work-item" />
				</>
			) : (
				<>
					<p role="status">{message}</p>
					<Button onClick={() => { setIsEditing(true); setMessage(''); }}>Start another draft</Button>
				</>
			)}
		</>
	);
}

export default function UnsavedFormWarningExample(): React.JSX.Element {
	return (
		<LinkCreateExitWarningProvider>
			<InlineCreateWithLeaveAction />
		</LinkCreateExitWarningProvider>
	);
}
