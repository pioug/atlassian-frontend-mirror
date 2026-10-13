import React, { useEffect, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { useLinkCreateCallback } from '@atlaskit/link-create/callback-context';
import { CreateForm } from '@atlaskit/link-create/create-form';
import { CreateFormLoader } from '@atlaskit/link-create/form-loader';
import LinkCreate from '@atlaskit/link-create/modal-create';
import { TextField } from '@atlaskit/link-create/text-field';
import type { LinkCreatePlugin } from '@atlaskit/link-create/types';

function DelayedForm(): React.JSX.Element {
	const [ready, setReady] = useState(false);
	const { onCreate, onCancel } = useLinkCreateCallback();
	useEffect(() => {
		const timer = window.setTimeout(() => setReady(true), 800);
		return () => window.clearTimeout(timer);
	}, []);
	if (!ready)
		return (
			<>
				<p role="status">Loading project fields</p>
				<CreateFormLoader />
			</>
		);
	return (
		<CreateForm<{ title: string }>
			onCancel={onCancel}
			onSubmit={async ({ title }: { title: string }) => {
				// Local example simulation only; no resource is persisted.
				await onCreate?.({
					url: 'https://example.atlassian.net/browse/DEMO-43',
					objectId: 'DEMO-43',
					objectType: 'task',
					data: { title },
				});
			}}
		>
			<TextField name="title" label="Summary" isRequired />
		</CreateForm>
	);
}

const plugin: LinkCreatePlugin = {
	group: { label: 'Work items', icon: 'issue', key: 'work-items' },
	label: 'Task',
	icon: 'task',
	key: 'task',
	form: <DelayedForm />,
};

export default function LoadingFormExample(): React.JSX.Element {
	const [active, setActive] = useState(false);
	return (
		<>
			<Button appearance="primary" onClick={() => setActive(true)}>
				Create task
			</Button>
			<LinkCreate
				active={active}
				plugins={[plugin]}
				entityKey="task"
				onCancel={() => setActive(false)}
				onComplete={() => setActive(false)}
			/>
		</>
	);
}
