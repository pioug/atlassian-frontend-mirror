import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { FormSpy } from '@atlaskit/link-create/form-spy';
import { Select } from '@atlaskit/link-create/select';
import { TextField } from '@atlaskit/link-create/text-field';
import LinkCreate from '@atlaskit/link-create/modal-create';
import { useLinkCreateCallback } from '@atlaskit/link-create/callback-context';
import { CreateForm } from '@atlaskit/link-create/create-form';
import type { LinkCreatePlugin } from '@atlaskit/link-create/types';

type FormValues = { title: string; workType: { label: string; value: string } | null };
const workTypes = [
	{ label: 'Task', value: 'task' },
	{ label: 'Bug', value: 'bug' },
];

function WorkItemForm(): React.JSX.Element {
	const { onCreate, onCancel } = useLinkCreateCallback();
	return (
		<CreateForm<FormValues>
			onCancel={onCancel}
			onSubmit={async ({ title, workType }) => {
				await onCreate?.({
					url: 'https://example.atlassian.net/browse/DEMO-42',
					objectId: 'DEMO-42',
					objectType: workType?.value ?? 'task',
					data: { title },
				});
			}}
		>
			<TextField name="title" label="Summary" isRequired maxLength={120} />
			<Select
				name="workType"
				label="Work type"
				options={workTypes}
				getOptionLabel={(option) => option.label}
				getOptionValue={(option) => option.value}
				defaultValue={workTypes[0]}
			/>
			<FormSpy<FormValues>>
				{({ values }) => <p>Selected type: {values.workType?.label ?? 'Choose a type'}</p>}
			</FormSpy>
		</CreateForm>
	);
}

const plugin: LinkCreatePlugin = {
	group: { label: 'Work items', icon: 'issue', key: 'work-items' },
	label: 'Work item',
	icon: 'issue',
	key: 'work-item',
	form: <WorkItemForm />,
};

export default function ModalCreateBasicExample(): React.JSX.Element {
	const [active, setActive] = useState(false);
	const [createdUrl, setCreatedUrl] = useState<string>();
	return (
		<>
			<Button appearance="primary" onClick={() => setActive(true)}>Create work item</Button>
			{createdUrl && <p>Example: would create a work item at {createdUrl} (local simulation only; nothing was saved).</p>}
			<LinkCreate
				active={active}
				modalTitle="Create work item"
				plugins={[plugin]}
				entityKey="work-item"
				triggeredFrom="project list"
				onCreate={({ url }) => setCreatedUrl(url)}
				onCancel={() => setActive(false)}
				onComplete={() => setActive(false)}
			/>
		</>
	);
}
