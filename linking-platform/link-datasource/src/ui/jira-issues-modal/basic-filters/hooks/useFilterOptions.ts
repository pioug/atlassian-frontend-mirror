import { useCallback, useRef, useState } from 'react';

import { useBasicFilterAGG } from '../../../../services/useBasicFilterAGG';
import {
  BasicFilterFieldType,
  FieldValuesResponse,
  SelectOption,
} from '../types';
import {
  mapFieldValuesToFilterOptions,
  mapFieldValuesToPageCursor,
  mapFieldValuesToTotalCount,
} from '../utils/transformers';

interface FilterOptionsProps {
  filterType: BasicFilterFieldType;
  cloudId: string;
}

export interface FetchFilterOptionsProps {
  pageCursor?: string;
  searchString?: string;
}

export interface FilterOptionsState {
  filterOptions: SelectOption[];
  fetchFilterOptions: (prop?: FetchFilterOptionsProps) => Promise<void>;
  reset: () => void;
  totalCount: number;
  pageCursor?: string;
  status: 'empty' | 'loading' | 'resolved' | 'rejected' | 'loadingMore';
  errors: unknown[];
}

export const useFilterOptions = ({
  filterType,
  cloudId,
}: FilterOptionsProps): FilterOptionsState => {
  const [filterOptions, setFilterOptions] = useState<SelectOption[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [status, setStatus] = useState<FilterOptionsState['status']>('empty');
  const [errors, setErrors] = useState<FilterOptionsState['errors']>([]);
  const [nextPageCursor, setNextPageCursor] = useState<string | undefined>(
    undefined,
  );
  const initialData = useRef<FieldValuesResponse>();

  const { getFieldValues } = useBasicFilterAGG();

  const fetchFilterOptions = useCallback(
    async ({ pageCursor, searchString } = {}) => {
      const isNewSearch = !pageCursor;

      isNewSearch ? setStatus('loading') : setStatus('loadingMore');

      const isRequestLikeInitialSearch = !pageCursor && !searchString;
      const { current: initialResponseData } = initialData;

      try {
        const response =
          isRequestLikeInitialSearch && initialResponseData
            ? initialResponseData
            : await getFieldValues({
                cloudId,
                jql: '',
                jqlTerm: filterType,
                searchString,
                pageCursor,
              });

        if (response.errors && response.errors.length > 0) {
          setStatus('rejected');
          setErrors(response.errors);
          return;
        }

        if (isNewSearch) {
          setFilterOptions(mapFieldValuesToFilterOptions(response));

          if (isRequestLikeInitialSearch) {
            /**
             * The initial dataset is used in couple of paths, eg: when a user searches and clears the search text.
             * During these times, we dont want to fetch data again and again, hence a mini cache setup to store and provide the initial dataset
             */
            initialData.current = response;
          }
        } else {
          setFilterOptions([
            ...filterOptions,
            ...mapFieldValuesToFilterOptions(response),
          ]);
        }
        setTotalCount(mapFieldValuesToTotalCount(response));
        setNextPageCursor(mapFieldValuesToPageCursor(response));
        setStatus('resolved');
      } catch (error) {
        setErrors([error]);
        setStatus('rejected');
      }
    },
    [cloudId, filterOptions, filterType, getFieldValues],
  );

  const reset = useCallback(() => {
    setStatus('empty');
    setFilterOptions([]);
    setTotalCount(0);
    setNextPageCursor(undefined);
    initialData.current = undefined;
  }, []);

  return {
    filterOptions,
    fetchFilterOptions,
    totalCount,
    pageCursor: nextPageCursor,
    status,
    reset,
    errors: status === 'rejected' ? errors : [],
  };
};
