import React, { useState } from 'react';

import LinkPicker from '@atlaskit/link-picker/link-picker';
import type { LinkPickerPlugin, LinkPickerProps } from '@atlaskit/link-picker/types';

const ProjectIcon = ({ alt }: { alt: string }): React.JSX.Element => (
	<span role="img" aria-label={alt}>
		◆
	</span>
);

const projectResults = [
	{
		objectId: 'platform-project',
		name: 'Platform project',
		url: 'https://example.com/projects/platform',
		icon: ProjectIcon,
		iconAlt: 'Project',
		container: 'Projects',
	},
	{
		objectId: 'design-system-project',
		name: 'Design system project',
		url: 'https://example.com/projects/design-system',
		icon: ProjectIcon,
		iconAlt: 'Project',
		container: 'Projects',
	},
];

const localProjectsPlugin: LinkPickerPlugin = {
	tabKey: 'projects',
	tabTitle: 'Projects',
	resolve: async ({ query }) => ({
		data: projectResults.filter((project) =>
			project.name.toLowerCase().includes(query.toLowerCase()),
		),
	}),
};

type SubmittedLink = Pick<Parameters<LinkPickerProps['onSubmit']>[0], 'url' | 'displayText'>;

export default function LocalSearchPluginExample(): React.JSX.Element {
	const [link, setLink] = useState<SubmittedLink | null>(null);
	const [message, setMessage] = useState('');

	return (
		<section aria-labelledby="add-project-link-heading">
			<h2 id="add-project-link-heading">Add a project link</h2>
			<LinkPicker
				plugins={[localProjectsPlugin]}
				url={link?.url}
				displayText={link?.displayText}
				onSubmit={({ url, displayText }) => {
					setLink({ url, displayText });
					setMessage('Project link added to the draft.');
				}}
				onCancel={() => setMessage('Link selection cancelled.')}
			/>
			{message && <p role="status">{message}</p>}
		</section>
	);
}
