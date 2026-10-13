import React from 'react';

import type { AutocompleteProvider } from '@atlaskit/jql-editor-common/autocomplete/types';
import { JQLEditorAsync } from '@atlaskit/jql-editor/async';

/** The host supplies its authenticated autocomplete provider and owns search execution. */
export default function JqlEditorAsyncExample({
	autocompleteProvider,
	onRunQuery,
}: {
	autocompleteProvider: AutocompleteProvider;
	onRunQuery: (query: string) => void;
}): React.JSX.Element {
	const [query, setQuery] = React.useState('project = PAY AND status = Open');
	const [requestedQuery, setRequestedQuery] = React.useState('');

	return (
		<section aria-labelledby="async-issue-search-heading">
			<h2 id="async-issue-search-heading">Search issues</h2>
			<p>The editor can load asynchronously while preserving the current query in its fallback.</p>
			<JQLEditorAsync
				analyticsSource="issue-search"
				autocompleteProvider={autocompleteProvider}
				query={query}
				locale="en"
				onUpdate={(nextQuery) => setQuery(nextQuery)}
				onSearch={(nextQuery) => {
					setRequestedQuery(nextQuery);
					onRunQuery(nextQuery);
				}}
			/>
			{requestedQuery && <p role="status">Search callback received: {requestedQuery}</p>}
		</section>
	);
}
