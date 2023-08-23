import {
  AutocompleteOptions,
  AutocompleteProvider,
} from '@atlaskit/jql-editor-common';

export type OnFields = AutocompleteProvider['onFields'];
export type OnOperators = AutocompleteProvider['onOperators'];
export type OnFunctions = AutocompleteProvider['onFunctions'];
export type OnValues = AutocompleteProvider['onValues'];

export type FieldValuesCache = {
  [key: string]: AutocompleteOptions;
};

export type UpdateCacheAction = {
  type: 'update-cache';
  payload: {
    cacheKey: string;
    values: AutocompleteOptions;
  };
};
