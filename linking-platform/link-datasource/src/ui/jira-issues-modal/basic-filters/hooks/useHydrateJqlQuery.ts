import { useCallback, useEffect, useState } from 'react';

import { useIntl } from 'react-intl-next';

import { OPERAND_EMPTY } from '@atlaskit/jql-ast';

import { useBasicFilterAGG } from '../../../../services/useBasicFilterAGG';
import { CommonBasicFilterHookState } from '../../../common/modal/popup-select/types';
import { SelectedOptionsMap } from '../types';
import { extractValuesFromNonComplexJQL } from '../utils/extractValuesFromNonComplexJQL';
import { removeFuzzyCharacter } from '../utils/isClauseTooComplex';
import { mapHydrateResponseData } from '../utils/transformers';

import { getAssigneeUnassignedFilterOption } from './useFilterOptions';

export interface HydrateJqlState extends CommonBasicFilterHookState {
  hydratedOptions: SelectedOptionsMap & { basicInputTextValue?: string };
  fetchHydratedJqlOptions: () => Promise<void>;
}

export const useHydrateJqlQuery = (
  cloudId: string,
  jql: string,
): HydrateJqlState => {
  const [hydratedOptions, setHydratedOptions] = useState<
    HydrateJqlState['hydratedOptions']
  >({});
  const { formatMessage } = useIntl();

  const [status, setStatus] = useState<HydrateJqlState['status']>('empty');
  const [errors, setErrors] = useState<HydrateJqlState['errors']>([]);

  const { getHydratedJQL } = useBasicFilterAGG();

  const fetchHydratedJqlOptions = useCallback(async () => {
    try {
      setStatus('loading');

      const response = await getHydratedJQL(cloudId, jql);

      if (response.errors && response.errors.length > 0) {
        setStatus('rejected');
        setErrors(response.errors);
        return;
      }

      const {
        assignee: mappedHydratedAssigneeValue,
        ...restOfMappedHydratedResponse
      } = mapHydrateResponseData(response);

      /**
       * Hydrate logic does not return text field, hence we parse and extract value from jql
       */
      const {
        text,
        summary,
        key,
        assignee: extractedAssigneeValue,
      } = extractValuesFromNonComplexJQL(jql);
      const [textFieldValue] = text || summary || key || [];

      const mappedValues = {
        ...restOfMappedHydratedResponse,
        /**
         * Special handling for assignee as we need to inject Unassigned value if JQL contains EMPTY keyword for assignee
         */
        assignee: [
          ...(mappedHydratedAssigneeValue || []), // all values provided by the hydrate API for assignee
          ...(extractedAssigneeValue?.includes(OPERAND_EMPTY) // checks and adds EMPTY filter option if extracted assignee values from jql contains EMPTY
            ? [getAssigneeUnassignedFilterOption(formatMessage)]
            : []),
        ],
        ...(textFieldValue
          ? { basicInputTextValue: removeFuzzyCharacter(textFieldValue) }
          : {}),
      };

      setHydratedOptions(mappedValues);
      setStatus('resolved');
    } catch (error) {
      setErrors([error]);
      setStatus('rejected');
    }
  }, [cloudId, formatMessage, getHydratedJQL, jql]);

  useEffect(() => {
    if (status !== 'rejected' && errors.length !== 0) {
      setErrors([]);
    }
  }, [errors.length, status]);

  return {
    hydratedOptions,
    fetchHydratedJqlOptions,
    status,
    errors,
  };
};
