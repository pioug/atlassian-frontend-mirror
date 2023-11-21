import { useCallback, useEffect, useState } from 'react';

import { useBasicFilterAGG } from '../../../../services/useBasicFilterAGG';
import { SelectedOptionsMap } from '../types';
import { mapHydrateResponseData } from '../utils/transformers';

export interface HydrateJqlState {
  hydratedOptions: SelectedOptionsMap;
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

      setHydratedOptions(mapHydrateResponseData(response));
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
