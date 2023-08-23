import { Reducer, useCallback, useReducer } from 'react';

import { di } from 'react-magnetic-di';
import type { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { concatMap } from 'rxjs/operators/concatMap';
import { delay } from 'rxjs/operators/delay';
import { filter } from 'rxjs/operators/filter';

import {
  AutocompleteOption,
  AutocompleteOptions,
  AutocompleteValueType,
} from '@atlaskit/jql-editor-common';

import { JqlEditorAutocompleteAnalyticsEvent } from '../../analytics';
import {
  GetAutocompleteSuggestions,
  JQLFieldResponse,
} from '../../common/types';
import findField$ from '../../utils/find-field-observable';
import { normalize } from '../../utils/strings';
import { USER_FIELD_TYPE } from '../constants';
import {
  FieldValuesCache,
  OnValues,
  UpdateCacheAction,
} from '../use-autocomplete-provider/types';
import { useFetchFieldValues } from '../use-fetch-field-values';

const getValueType = (
  field: JQLFieldResponse,
): AutocompleteValueType | void => {
  if (field.types.includes(USER_FIELD_TYPE)) {
    return 'user';
  }

  return undefined;
};

export type FieldValuesReducer = Reducer<FieldValuesCache, UpdateCacheAction>;
const fieldValuesReducer: FieldValuesReducer = (
  state: FieldValuesCache,
  action: UpdateCacheAction,
) => {
  const { cacheKey, values } = action.payload;
  return {
    ...state,
    [cacheKey]: values,
  };
};

const initialState = {};

// Hard coded delay before making a fetch call for operands.
const OPERANDS_DELAY_MS = 650;

// Used to remove emails from user display names in autocomplete values, which come in format: "Name - email".
// Pattern below is specific enough for this purpose and we should avoid writing a more complex email matcher.
const BASIC_REMOVE_EMAIL_REGEX = /\s-\s\S+@\S+\.\S+$/;

const useOnValues = (
  jqlSearchableFields$: Observable<JQLFieldResponse>,
  getSuggestions: GetAutocompleteSuggestions,
  createAndFireAnalyticsEvent: (
    payload: JqlEditorAutocompleteAnalyticsEvent,
  ) => void,
) => {
  di(useReducer);

  const fetchFieldValues = useFetchFieldValues(
    getSuggestions,
    createAndFireAnalyticsEvent,
  );
  const [fieldValuesCache, dispatch] = useReducer(
    fieldValuesReducer,
    initialState,
  );

  return useCallback<OnValues>(
    (query?: string, field?: string): Observable<AutocompleteOptions> => {
      if (typeof field !== 'string' || field === '') {
        return empty();
      }

      const field$ = findField$(jqlSearchableFields$, field);

      // API expects unquoted and unescaped values
      const normalizedField = normalize(field);
      const normalizedQuery = query !== undefined ? normalize(query) : '';

      // Cache values by field + query
      const cacheKey = `${normalizedField}:${normalizedQuery}`;

      const isCacheHit = Object.prototype.hasOwnProperty.call(
        fieldValuesCache,
        cacheKey,
      );

      return field$.pipe(
        filter(matchingField => matchingField.auto === 'true'),
        concatMap(matchingField => {
          if (isCacheHit) {
            return of(fieldValuesCache[cacheKey]);
          }

          // If we have a cfid then use it to fetch autocomplete suggestions as results will always be unique.
          // Otherwise it's possible `normalizedField` will match against multiple fields in the API and thus
          // return no data.
          const fieldNameForFetch = matchingField.cfid ?? normalizedField;

          // We emit a single value using Observable.of(null) and delay that event before fetching field values so we
          // can mimic debounce behaviour.
          return of(null).pipe(
            delay(OPERANDS_DELAY_MS),
            concatMap(() =>
              fetchFieldValues(fieldNameForFetch, normalizedQuery)
                .then(values => {
                  const valueType = getValueType(matchingField);
                  if (valueType === 'user') {
                    values.forEach((value: AutocompleteOption) => {
                      value.valueType = valueType;
                      // REST autocomplete API returns user display names with this format: "Name - email". To be
                      // consistent with hydration API, we want to remove email from this name for rich inline nodes.
                      value.nameOnRichInlineNode = value.name.replace(
                        BASIC_REMOVE_EMAIL_REGEX,
                        '',
                      );
                    });
                  }
                  // Save response to in-memory cache
                  dispatch({
                    type: 'update-cache',
                    payload: {
                      cacheKey,
                      values,
                    },
                  });
                  return values;
                })
                .catch(() => []),
            ),
          );
        }),
        // We can filter out empty arrays as there is nothing to consume
        filter(operands => operands.length > 0),
      );
    },
    [jqlSearchableFields$, fieldValuesCache, fetchFieldValues],
  );
};

export default useOnValues;
