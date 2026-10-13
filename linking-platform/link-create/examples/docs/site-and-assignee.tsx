import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { useLinkCreateCallback } from '@atlaskit/link-create/callback-context';
import { CreateForm } from '@atlaskit/link-create/create-form';
import { FormSpy } from '@atlaskit/link-create/form-spy';
import LinkCreate from '@atlaskit/link-create/modal-create';
import { SiteSelect } from '@atlaskit/link-create/select';
import type { SitePickerOptionType } from '@atlaskit/link-create/select';
import type { LinkCreatePlugin } from '@atlaskit/link-create/types';
import { UserPicker } from '@atlaskit/link-create/user-picker';

const sites: SitePickerOptionType[] = [
	{
		label: 'Example Jira site',
		value: { cloudId: 'example-cloud-id', url: 'https://example.atlassian.net' },
	},
];

type AssignmentFormValues = {
	site: SitePickerOptionType | null;
	assignee: { id: string } | undefined;
};

function AssignmentForm(): React.JSX.Element {
	const { onCreate, onCancel } = useLinkCreateCallback();
	return (
		<CreateForm<AssignmentFormValues>
			initialValues={{ site: sites[0], assignee: undefined }}
			onCancel={onCancel}
			onSubmit={async ({ site, assignee }: AssignmentFormValues) => {
				// Local example simulation only; production code should call its create API and pass the persisted resource to onCreate.
				await onCreate?.({
					url: `${site?.value.url}/browse/DEMO-42`,
					objectId: 'DEMO-42',
					objectType: 'issue',
					data: { assigneeId: assignee?.id },
				});
			}}
		>
			<SiteSelect name="site" options={sites} />
			<FormSpy<AssignmentFormValues>>
				{({ values }) =>
					values.site ? (
						<UserPicker
							name="assignee"
							label="Assignee"
							productKey="jira"
							siteId={values.site.value.cloudId}
							defaultValue={undefined}
						/>
					) : null
				}
			</FormSpy>
		</CreateForm>
	);
}

const plugin: LinkCreatePlugin = {
	group: { label: 'Work items', icon: 'issue', key: 'work-items' },
	label: 'Assigned work item',
	icon: 'issue',
	key: 'assigned-work-item',
	form: <AssignmentForm />,
};

export default function SiteAndAssigneeExample(): React.JSX.Element {
	const [active, setActive] = useState(false);
	return (
		<>
			<Button appearance="primary" onClick={() => setActive(true)}>
				Create assigned work item
			</Button>
			<LinkCreate
				active={active}
				plugins={[plugin]}
				entityKey="assigned-work-item"
				onCancel={() => setActive(false)}
				onComplete={() => setActive(false)}
			/>
		</>
	);
}
