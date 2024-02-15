import React, { useCallback, useMemo } from 'react';

import {
  GetAutocompleteInitialData,
  GetAutocompleteSuggestions,
  useAutocompleteProvider,
} from '@atlaskit/jql-editor-autocomplete-rest';

import {
  jqlFieldsMock,
  jqlFunctionsMock,
  jqlValuesMock,
} from '../examples-utils/data';
import { Container } from '../examples-utils/styled';
import { ExternalMessage, JQLEditor } from '../src';

const getAutocompleteInitialData: GetAutocompleteInitialData = () =>
  // Simulate fetching initial data from an API
  new Promise(resolve => {
    setTimeout(
      () =>
        resolve({
          jqlFields: jqlFieldsMock,
          jqlFunctions: jqlFunctionsMock,
        }),
      150,
    );
  });

const getAutocompleteSuggestions: GetAutocompleteSuggestions = () =>
  // Simulate fetching autocomplete suggestions from an API
  new Promise(resolve => {
    setTimeout(
      () =>
        resolve({
          results: jqlValuesMock,
        }),
      150,
    );
  });

export default () => {
  const autocompleteProvider = useAutocompleteProvider(
    'my-app',
    getAutocompleteInitialData,
    getAutocompleteSuggestions,
  );

  const onSearch = useCallback((jql: string) => {
    // Do some action on search
    console.log(jql);
  }, []);

  // Plug in external errors (e.g. server-side JQL validation errors)
  const messages: ExternalMessage[] = useMemo(
    () => [
      {
        type: 'error',
        message: `The value 'ABC' does not exist for the field 'project'`,
      },
      {
        type: 'error',
        message: `A value with ID '123' does not exist for the field 'issuetype'`,
      },
      {
        type: 'error',
        message: `Unable to find JQL function 'someFakeFunction()`,
      },
      {
        type: 'error',
        message: `Error in the JQL Query: A function name cannot be empty. (line 1, character 7)`,
        errorType: 'EMPTY_FUNCTION',
      },
    ],
    [],
  );

  return (
    <Container>
      <JQLEditor
        analyticsSource={'my-app'}
        autocompleteProvider={autocompleteProvider}
        query={
          'assignee = EMPTY AND status = 111 AND reporter in (rjuedbergtlfrde, \'iikibvcbvfnfglv\', "gvcehdrrgtvvuen")'
        }
        locale={'en'}
        onSearch={onSearch}
        messages={messages}
      />
    </Container>
  );
};
