import { useCallback, useEffect, useState } from 'react';

import { useBasicFilterAGG } from '../../../../services/useBasicFilterAGG';
import { SelectedOptionsMap } from '../types';
import { extractValuesFromNonComplexJQL } from '../utils/extractValuesFromNonComplexJQL';
import { removeFuzzyCharacter } from '../utils/isClauseTooComplex';
import { mapHydrateResponseData } from '../utils/transformers';

export interface HydrateJqlState {
  hydratedOptions: SelectedOptionsMap & { basicInputTextValue?: string };
  fetchHydratedJqlOptions: () => Promise<void>;
  status: 'empty' | 'loading' | 'resolved' | 'rejected';
  errors: unknown[];
}

export const useHydrateJqlQuery = (
  cloudId: string,
  jql: string,
): HydrateJqlState => {
  const [hydratedOptions, setHydratedOptions] = useState<
    HydrateJqlState['hydratedOptions']
  >({});
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

      /**
       * Hydrate logic does not return text field, hence we parse and extract value from jql
       */
      const { text, summary, key } = extractValuesFromNonComplexJQL(jql);
      const [textFieldValue] = text || summary || key || [];

      const mappedValues = {
        ...mapHydrateResponseData(response),
        basicInputTextValue: removeFuzzyCharacter(textFieldValue),
      };

      setHydratedOptions(mappedValues);
      setStatus('resolved');
    } catch (error) {
      setErrors([error]);
      setStatus('rejected');
    }
  }, [cloudId, getHydratedJQL, jql]);

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
