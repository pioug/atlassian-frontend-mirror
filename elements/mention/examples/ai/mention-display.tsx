import React from 'react';

import Mention from '@atlaskit/mention/mention';
import MentionItem from '@atlaskit/mention/mention-item';
import MentionList from '@atlaskit/mention/mention-list';
import ResourcedMention from '@atlaskit/mention/resourced-mention';
import ResourcedMentionList from '@atlaskit/mention/resourced-mention-list';
import type { MentionDescription } from '@atlaskit/mention/types';
import type { MentionProvider } from '@atlaskit/mention/types';

const mentions: MentionDescription[] = [
	{ id: 'account-123', name: 'Avery Chen', mentionName: 'Avery Chen' },
	{ id: 'account-456', name: 'Jordan Lee', mentionName: 'Jordan Lee' },
];

/** Pass the same host-backed provider used by the editor's mention integration. */
export default function MentionDisplay({
	resourceProvider,
}: {
	resourceProvider: MentionProvider;
}): React.JSX.Element {
	const [selectedName, setSelectedName] = React.useState('');
	const handleSelection = (mention: MentionDescription) => {
		setSelectedName(mention.name ?? mention.id);
	};

	return (
		<div>
			<p>
				Assigned to <Mention id="account-123" text="Avery Chen" />
			</p>
			<ResourcedMention
				id="account-123"
				text="Avery Chen"
				mentionProvider={Promise.resolve(resourceProvider)}
			/>
			<MentionList mentions={mentions} onSelection={handleSelection} />
			<ResourcedMentionList
				query="avery"
				resourceProvider={resourceProvider}
				onSelection={handleSelection}
			/>
			<MentionItem mention={mentions[0]} onSelection={handleSelection} />
			{selectedName && <p role="status">Selected {selectedName}</p>}
		</div>
	);
}
