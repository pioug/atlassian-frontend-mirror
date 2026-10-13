import React, { useState } from 'react';

import { useLinkCreateCallback } from '@atlaskit/link-create/callback-context';
import { CreateForm } from '@atlaskit/link-create/create-form';
import { InlineCreate } from '@atlaskit/link-create/inline-create';
import { TextField } from '@atlaskit/link-create/text-field';
import type { LinkCreatePlugin } from '@atlaskit/link-create/types';
import Link from '@atlaskit/link/link';

function QuickNoteForm(): React.JSX.Element {
	const { onCreate, onCancel } = useLinkCreateCallback();
	return (
		<CreateForm<{ title: string }>
			onCancel={onCancel}
			onSubmit={async ({ title }: { title: string }) => {
				await onCreate?.({
					url: 'https://example.atlassian.net/wiki/spaces/TEAM/pages/123',
					objectId: '123',
					objectType: 'page',
					data: { title },
				});
			}}
		>
			<TextField name="title" label="Page title" isRequired maxLength={120} />
		</CreateForm>
	);
}

const plugin: LinkCreatePlugin = {
	group: { label: 'Pages', icon: 'page', key: 'pages' },
	label: 'Project page',
	icon: 'page',
	key: 'project-page',
	form: <QuickNoteForm />,
};

export default function InlineCreateExample(): React.JSX.Element {
	const [createdUrl, setCreatedUrl] = useState<string>();
	return (
		<section aria-labelledby="quick-create-heading">
			<h2 id="quick-create-heading">Create a project page</h2>
			<InlineCreate
				plugins={[plugin]}
				entityKey="project-page"
				triggeredFrom="project overview"
				onCreate={({ url }) => setCreatedUrl(url)}
			/>
			{createdUrl && (
				<p>
					Example: would create a page at <Link href={createdUrl}>{createdUrl}</Link> (local
					simulation only; nothing was saved).
				</p>
			)}
		</section>
	);
}
