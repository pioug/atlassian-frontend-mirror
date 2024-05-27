import { useCallback, useRef, useState } from 'react';

import { useIntl } from 'react-intl-next';

import {
  getUserRecommendations,
  type OptionData,
} from '@atlaskit/smart-user-picker';

import { type FilterPopupSelectProps } from '../../../common/modal/popup-select';
import { type SelectOption } from '../../../common/modal/popup-select/types';

interface FetchFilterOptionsProps {
  cloudId: string;
  userId: string;
  searchTerm: string;
}

interface UserRecommendationState {
  filterOptions: SelectOption[];
  reset: () => void;
  status: FilterPopupSelectProps['status'];
  errors: unknown[];
  fetchFilterOptions: (prop: FetchFilterOptionsProps) => Promise<any>;
}

const useRecommendation = (): UserRecommendationState => {
  const intl = useIntl();

  const [filterOptions, setFilterOptions] = useState<SelectOption[]>([]);
  const [status, setStatus] =
    useState<UserRecommendationState['status']>('empty');
  const [errors, setErrors] = useState<UserRecommendationState['errors']>([]);
  const initialData = useRef<OptionData[]>();

  const convertRecommendationsToFilterOptions = (
    recommendations: OptionData[],
  ): SelectOption[] => {
    return recommendations.map(item => ({
      optionType: 'avatarLabel',
      label: item.name,
      value: item.id,
      avatar: item.avatarUrl,
    }));
  };

  const fetchFilterOptions = useCallback(
    async ({ userId, cloudId, searchTerm }: FetchFilterOptionsProps) => {
      setStatus('loading');

      const requestParams = {
        context: {
          contextType: 'contributors',
          principalId: userId || '',
          productAttributes: {
            isEntitledConfluenceExternalCollaborator: true,
          },
          productKey: 'confluence',
          siteId: cloudId,
        },
        includeGroups: false,
        includeTeams: false,
        includeUsers: true,
        maxNumberOfResults: 10,
        performSearchQueryOnly: false,
        query: searchTerm,
      };

      const { current: initialResponseData } = initialData;
      const isRequestLikeInitialSearch = !searchTerm;

      try {
        const recommendations =
          isRequestLikeInitialSearch && initialResponseData
            ? initialResponseData
            : await getUserRecommendations(requestParams, intl);

        setFilterOptions(
          convertRecommendationsToFilterOptions(recommendations),
        );
        setStatus('resolved');

        if (!searchTerm) {
          /**
           * The initial dataset is used in couple of paths, eg: when a user searches and clears the search text.
           * During these times, we dont want to fetch data again and again, hence a mini cache setup to store and provide the initial dataset
           */
          initialData.current = recommendations;
        }
      } catch (error) {
        setStatus('rejected');
        setErrors([error]);
      }
    },
    [intl],
  );

  const reset = useCallback(() => {
    setStatus('empty');
    setFilterOptions([]);
    setErrors([]);
    initialData.current = undefined;
  }, []);

  return {
    status,
    errors,
    filterOptions,
    reset,
    fetchFilterOptions,
  };
};

export default useRecommendation;
