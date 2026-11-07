import React, { useEffect, useRef } from 'react';

import { FormattedMessage } from 'react-intl';

import type { Jast } from '@atlaskit/jql-ast/query';
import { useAutocompleteProvider } from '@atlaskit/jql-editor-autocomplete-rest/use-autocomplete-provider';
import JQLEditor from '@atlaskit/jql-editor/ui';

import { makeGetJqlAutocompleteData } from '../../../services/makeGetJqlAutocompleteData';
import { makeGetJqlSuggestionsData } from '../../../services/makeGetJqlSuggestionsData';

export interface JiraJQLEditorProps {
	autoFocus?: boolean;
	cloudId: string;
	/** Use compact editor sizing for an embedded toolbar. */
	isCompact?: boolean;
	isSearching?: boolean;
	onChange?: (query: string, jast: Jast) => void;
	onSearch: () => void;
	query: string;
}

export const JiraJQLEditor = ({
	cloudId,
	autoFocus = true,
	isCompact = false,
	isSearching,
	onChange,
	onSearch,
	query,
}: JiraJQLEditorProps): React.JSX.Element => {
	const autocompleteProvider = useAutocompleteProvider(
		'link-datasource',
		makeGetJqlAutocompleteData(cloudId),
		makeGetJqlSuggestionsData(cloudId),
	);

	// This is an expected (pretty strange imo) way of making sure text field is in focus when rendered
	const inputRef = useRef({ focus: () => {} });
	useEffect(() => {
		if (!autoFocus) {
			return;
		}
		requestAnimationFrame(() => {
			inputRef.current?.focus();
		});
	}, [autoFocus]);

	const searchIfValidJql = (_: string, jast: Jast) => {
		if (jast.errors.length === 0) {
			onSearch();
		}
	};

	return (
		<JQLEditor
			analyticsSource="link-datasource"
			autocompleteProvider={autocompleteProvider}
			onSearch={searchIfValidJql}
			onUpdate={onChange}
			isSearching={isSearching}
			isCompact={isCompact}
			inputRef={inputRef}
			query={query}
			aria-label={
				<FormattedMessage defaultMessage="JQL Query Editor" id="link-datasource.jira.jql-editor" />
			}
		/>
	);
};
