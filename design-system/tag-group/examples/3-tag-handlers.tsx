import React, { useState } from 'react';

import Tag from '@atlaskit/tag';
import TagGroup from '@atlaskit/tag-group';

interface MyTagGroupProps {
	alignment: 'start' | 'end';
}

export function MyTagGroup({ alignment }: MyTagGroupProps) {
	const [tags, setTags] = useState(['Candy canes', 'Tiramisu', 'Gummi bears', 'Wagon Wheels']);

	const handleRemoveRequest = () => true;

	const handleRemoveComplete = (text: string) => {
		setTags(tags.filter((str) => str !== text));
		console.log(`Removed ${text}.`);
	};

	return (
		<TagGroup alignment={alignment} label="Tags with handlers">
			{tags.map((text) => (
				<Tag
					key={text}
					onAfterRemoveAction={handleRemoveComplete}
					onBeforeRemoveAction={handleRemoveRequest}
					text={text}
				/>
			))}
		</TagGroup>
	);
}

export default () => (
	<div>
		<MyTagGroup alignment="start" />
		<MyTagGroup alignment="end" />
	</div>
);
