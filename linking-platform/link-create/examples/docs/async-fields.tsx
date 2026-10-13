import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { AsyncSelect } from '@atlaskit/link-create/async-select';
import { useLinkCreateCallback } from '@atlaskit/link-create/callback-context';
import { CreateForm } from '@atlaskit/link-create/create-form';
import LinkCreate from '@atlaskit/link-create/modal-create';
import type { LinkCreatePlugin } from '@atlaskit/link-create/types';

const mockProjects = [
	{ label: 'Website refresh', value: 'web' },
	{ label: 'Accessibility review', value: 'a11y' },
];

function ProjectForm(): React.JSX.Element {
	const { onCreate, onCancel } = useLinkCreateCallback();
	const loadOptions = useCallback(async (query: string) => {
		return mockProjects.filter((project) =>
			project.label.toLowerCase().includes(query.toLowerCase()),
		);
	}, []);
	return (
		<CreateForm<{ project: { label: string; value: string } | null }>
			onCancel={onCancel}
			onSubmit={async ({ project }: { project: { label: string; value: string } | null }) => {
				if (!project) return { project: 'Choose a project.' };
				// Local example simulation only; production code should call its create API and pass the persisted resource to onCreate.
				await onCreate?.({
					url: `https://example.atlassian.net/browse/${project.value}`,
					objectId: project.value,
					objectType: 'project',
				});
			}}
		>
			<AsyncSelect
				name="project"
				label="Project"
				isRequired
				isSearchable
				defaultOptions
				loadOptions={loadOptions}
			/>
		</CreateForm>
	);
}

const plugin: LinkCreatePlugin = {
	group: { label: 'Projects', icon: 'project', key: 'projects' },
	label: 'Project task',
	icon: 'task',
	key: 'project-task',
	form: <ProjectForm />,
};

export default function AsyncFieldsExample(): React.JSX.Element {
	const [active, setActive] = useState(false);
	return (
		<>
			<Button appearance="primary" onClick={() => setActive(true)}>
				Create task
			</Button>
			<LinkCreate
				active={active}
				plugins={[plugin]}
				entityKey="project-task"
				onCancel={() => setActive(false)}
				onComplete={() => setActive(false)}
			/>
		</>
	);
}
