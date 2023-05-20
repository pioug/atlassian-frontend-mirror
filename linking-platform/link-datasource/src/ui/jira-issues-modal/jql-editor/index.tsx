import React, { useEffect, useRef } from 'react';

import { JQLEditor } from '@atlassianlabs/jql-editor';
import { useAutocompleteProvider } from '@atlassianlabs/jql-editor-autocomplete-rest';

import { makeGetJqlAutocompleteData } from '../../../services/makeGetJqlAutocompleteData';
import { makeGetJqlSuggestionsData } from '../../../services/makeGetJqlSuggestionsData';

export interface JiraJQLEditorProps {
  cloudId: string;
  onChange?: (query: string) => void;
  onSearch: (query: string) => void;
  query: string;
}

export const JiraJQLEditor: React.FC<JiraJQLEditorProps> = props => {
  const { cloudId, onChange, onSearch, query } = props;

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

  return (
    <JQLEditor
      analyticsSource="link-datasource"
      autocompleteProvider={autocompleteProvider}
      onSearch={onSearch}
      onUpdate={onChange}
      inputRef={inputRef}
      query={query}
    />
  );
};
