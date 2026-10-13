import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { useLinkCreateCallback } from '@atlaskit/link-create/callback-context';
import { CreateField } from '@atlaskit/link-create/create-field';
import { CreateForm } from '@atlaskit/link-create/create-form';
import LinkCreate from '@atlaskit/link-create/modal-create';
import type { LinkCreatePlugin } from '@atlaskit/link-create/types';
import Textfield from '@atlaskit/textfield/text-field';

function CustomForm(): React.JSX.Element {
	const { onCreate, onCancel } = useLinkCreateCallback();
	return (
		<CreateForm<{ key: string }>
			onCancel={onCancel}
			onSubmit={async ({ key }: { key: string }) => {
				// Local example simulation only; no resource is persisted.
				await onCreate?.({
					url: `https://example.atlassian.net/browse/${key}`,
					objectId: key,
					objectType: 'issue',
				});
			}}
		>
			<CreateField
				testId="issue-key"
				name="key"
				label="Issue key"
				isRequired
				validationHelpText="Enter a key such as DEMO-42."
			>
				{({ fieldId, isRequired, isInvalid, ...fieldProps }) => (
					<Textfield
						{...fieldProps}
						id={fieldId}
						required={isRequired}
						aria-invalid={isInvalid}
						placeholder="DEMO-42"
					/>
				)}
			</CreateField>
		</CreateForm>
	);
}

const plugin: LinkCreatePlugin = {
	group: { label: 'Work items', icon: 'issue', key: 'work-items' },
	label: 'Issue',
	icon: 'issue',
	key: 'issue',
	form: <CustomForm />,
};

export default function CustomFieldExample(): React.JSX.Element {
	const [active, setActive] = useState(false);
	return (
		<>
			<Button appearance="primary" onClick={() => setActive(true)}>
				Create issue
			</Button>
			<LinkCreate
				active={active}
				plugins={[plugin]}
				entityKey="issue"
				onCancel={() => setActive(false)}
				onComplete={() => setActive(false)}
			/>
		</>
	);
}
