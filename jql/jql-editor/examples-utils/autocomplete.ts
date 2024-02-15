import type {
  GetAutocompleteInitialData,
  GetAutocompleteSuggestions,
} from '@atlaskit/jql-editor-autocomplete-rest';

import { jqlFieldsMock, jqlFunctionsMock, jqlValuesMock } from './data';

export const getAutocompleteInitialData: GetAutocompleteInitialData = () =>
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

export const getAutocompleteSuggestions: GetAutocompleteSuggestions = () =>
  new Promise(resolve => {
    setTimeout(
      () =>
        resolve({
          results: jqlValuesMock,
        }),
      150,
    );
  });
