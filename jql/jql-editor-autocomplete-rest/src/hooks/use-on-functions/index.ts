import { useCallback } from 'react';

import escapeRegExp from 'lodash/escapeRegExp';
import type { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { concatMap } from 'rxjs/operators/concatMap';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';
import { toArray } from 'rxjs/operators/toArray';

import { AutocompleteOptions } from '@atlaskit/jql-editor-common';

import { JQLFieldResponse, JQLFunctionResponse } from '../../common/types';
import findField$ from '../../utils/find-field-observable';
import { OnFunctions } from '../use-autocomplete-provider/types';

const useOnFunctions = (
  jqlSearchableFields$: Observable<JQLFieldResponse>,
  jqlFunctions$: Observable<JQLFunctionResponse>,
) => {
  return useCallback<OnFunctions>(
    (
      query?: string,
      field?: string,
      isListOperator?: boolean,
    ): Observable<AutocompleteOptions> => {
      if (typeof field !== 'string' || field === '') {
        return empty();
      }

      const filterRegex =
        typeof query === 'string' && query !== ''
          ? new RegExp(`^${escapeRegExp(query)}[^$]`, 'i')
          : undefined;

      const field$ = findField$(jqlSearchableFields$, field);

      // Find all functions that match our query with a type that intersects our field types
      return field$.pipe(
        concatMap(matchingField =>
          jqlFunctions$.pipe(
            filter(
              func =>
                !filterRegex || func.displayName.match(filterRegex) !== null,
            ),
            filter(
              func =>
                // Do not include functions that return a list unless we are using a list operator
                !!isListOperator || func.isList !== 'true',
            ),
            filter(
              func =>
                // Include functions with a type that intersects our field types
                func.types.filter(type => matchingField.types.includes(type))
                  .length > 0,
            ),
            map(func => ({
              name: func.displayName,
              value: func.value,
              isListFunction:
                func.isList === 'true' ||
                func.supportsListAndSingleValueOperators === 'true',
            })),
            toArray(),
          ),
        ),
        // We can filter out empty arrays as there is nothing to consume
        filter(operands => operands.length > 0),
      );
    },
    [jqlSearchableFields$, jqlFunctions$],
  );
};

export default useOnFunctions;
