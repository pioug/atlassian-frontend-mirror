import React from 'react';

import type { AutocompleteProvider } from '@atlaskit/jql-editor-common/autocomplete/types';
import { _default_1 as JQLEditor } from '@atlaskit/jql-editor/ui';

/** The host supplies its authenticated, product-aware autocomplete provider. */
export default function JqlEditorControlled({
	autocompleteProvider,
	onRunQuery,
}: {
	autocompleteProvider: AutocompleteProvider;
	onRunQuery: (query: string) => void;
}): React.JSX.Element {
	const [query, setQuery] = React.useState('project = PAY AND status = Open');
	const [requestedQuery, setRequestedQuery] = React.useState('');

	return (
		<section aria-labelledby="issue-search-heading">
			<h2 id="issue-search-heading">Search issues</h2>
			<p>Write a JQL query. Use autocomplete to find fields and values.</p>
			<JQLEditor
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
