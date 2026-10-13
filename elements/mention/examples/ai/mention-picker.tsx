import React from 'react';

import { MentionPickerWithAnalytics as MentionPicker } from '@atlaskit/mention/mention-picker';
import type { MentionProvider } from '@atlaskit/mention/types';

/** The host supplies its authenticated mention service provider. */
export default function MentionPickerExample({
	resourceProvider,
}: {
	resourceProvider: MentionProvider;
}): React.JSX.Element {
	const [selectedName, setSelectedName] = React.useState('');
	const [query, setQuery] = React.useState('');

	return (
		<div>
			<label htmlFor="comment-mention-search">Add a person to the comment</label>
			<input
				id="comment-mention-search"
				type="text"
				aria-describedby="mention-help"
				value={query}
				onChange={(event) => setQuery(event.currentTarget.value)}
			/>
			<p id="mention-help">Type a name, then choose a result.</p>
			<MentionPicker
				target="#comment-mention-search"
				query={query}
				resourceProvider={resourceProvider}
				onSelection={(mention) => setSelectedName(mention.name ?? mention.id)}
			/>
			{selectedName && <p role="status">Added @{selectedName}</p>}
		</div>
	);
}
