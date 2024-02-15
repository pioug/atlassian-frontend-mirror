import React, { useEffect, useRef } from 'react';

import { Jast } from '@atlaskit/jql-ast';
import { JQLEditor } from '@atlaskit/jql-editor';
import { useAutocompleteProvider } from '@atlaskit/jql-editor-autocomplete-rest';

import { makeGetJqlAutocompleteData } from '../../../services/makeGetJqlAutocompleteData';
import { makeGetJqlSuggestionsData } from '../../../services/makeGetJqlSuggestionsData';

export interface JiraJQLEditorProps {
  cloudId: string;
  isSearching?: boolean;
  onChange?: (query: string) => void;
  onSearch: () => void;
  query: string;
}

export const JiraJQLEditor: React.FC<JiraJQLEditorProps> = props => {
  const { cloudId, isSearching, onChange, onSearch, query } = props;

  const autocompleteProvider = useAutocompleteProvider(
    'link-datasource',
    makeGetJqlAutocompleteData(cloudId),
    makeGetJqlSuggestionsData(cloudId),
  );

  // This is an expected (pretty strange imo) way of making sure text field is in focus when rendered
  const inputRef = useRef({ focus: () => {} });
  useEffect(() => {
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, []);

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
      inputRef={inputRef}
      query={query}
    />
  );
};
