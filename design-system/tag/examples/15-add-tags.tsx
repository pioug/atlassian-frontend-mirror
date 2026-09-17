import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import { Stack } from '@atlaskit/primitives/compiled';
import Tag from '@atlaskit/tag/tag-new';

const tagNames = [
	'Design',
	'Engineering',
	'Research',
	'A realllllllllllllllllyyyyyyyyyyyyyyyy long tag name that should be truncated',
];

export default function AddTagExample(): React.JSX.Element {
	const [tag, setTag] = useState<string>();
	const [nextTagIndex, setNextTagIndex] = useState(0);

	const addTag = () => {
		setTag(tagNames[nextTagIndex % tagNames.length]);
		setNextTagIndex((index) => index + 1);
	};

	return (
		<Stack space="space.150" alignInline="start">
			<Button isDisabled={tag !== undefined} onClick={addTag}>
				Add tag
			</Button>
			<ExitingPersistence>
				{tag && (
					<Tag
						key={tag}
						text={tag}
						removeButtonLabel="Remove"
						onAfterRemoveAction={() => setTag(undefined)}
					/>
				)}
			</ExitingPersistence>
		</Stack>
	);
}
