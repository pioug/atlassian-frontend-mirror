import { useCallback, useEffect, useMemo, useState } from 'react';

import debounce from 'lodash/debounce';

import {
  EntityType,
  fetchUserRecommendations,
  UserSearchItem,
} from '@atlaskit/smart-common';
import { ActionTypes, Value } from '@atlaskit/user-picker';

import type { UseUserRecommendationsProps } from '../../types';
import useFunctionUsageTracking from '../use-function-usage-tracking';

const MAX_NUMBER_RESULTS = 25;

const DEFAULT_DEBOUNCE_TIME_MS = 150;

const defaultProps: Partial<UseUserRecommendationsProps> = {
  debounceTimeMs: DEFAULT_DEBOUNCE_TIME_MS,
  maxNumberOfResults: MAX_NUMBER_RESULTS,
  principalId: 'Context',
  includeUsers: true,
};

export const instrumentFailureOption = [
  {
    id: 'not-used',
    name: 'User Picker is not instrumented correctly',
    entityType: EntityType.USER,
    avatarUrl: '',
  },
];

const useUserRecommendations = (props: UseUserRecommendationsProps) => {
  const {
    baseUrl,
    childObjectId,
    containerId,
    debounceTimeMs,
    fieldId,
    includeUsers,
    includeGroups,
    includeTeams,
    maxNumberOfResults,
    objectId,
    preload,
    principalId,
    productAttributes,
    productKey,
    cpusSearchQuery,
    tenantId,
  } = { ...defaultProps, ...props };
  const [recommendations, setRecommendations] = useState<UserSearchItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>();

  const fetchRecommendations = useCallback(
    async (query?: string, sessionId?: string) => {
      setIsLoading(true);
      try {
        const recommendedUsers = await fetchUserRecommendations({
          baseUrl,
          context: {
            childObjectId,
            containerId,
            objectId,
            principalId,
            productAttributes,
            productKey,
            contextType: fieldId,
            siteId: tenantId,
            sessionId: sessionId,
          },
          includeUsers,
          includeGroups,
          includeTeams,
          maxNumberOfResults,
          searchQuery: cpusSearchQuery,
          query,
        });
        setRecommendations(recommendedUsers);
      } catch (error) {
        setError(error);
      }
      setIsLoading(false);
    },
    [
      baseUrl,
      childObjectId,
      containerId,
      fieldId,
      includeGroups,
      includeTeams,
      includeUsers,
      maxNumberOfResults,
      objectId,
      principalId,
      productAttributes,
      productKey,
      cpusSearchQuery,
      tenantId,
    ],
  );

  const debouncedFetchRecommendations = useMemo(
    () => debounce(fetchRecommendations, debounceTimeMs),
    [fetchRecommendations, debounceTimeMs],
  );

  useEffect(() => {
    if (preload) {
      debouncedFetchRecommendations('');
    }
  }, [preload, debouncedFetchRecommendations]);

  // TODO - analytics
  const onInputChange = useCallback(
    (query?: string, sessionId?: string) => {
      debouncedFetchRecommendations(query, sessionId);
    },
    [debouncedFetchRecommendations],
  );

  // TODO - analytics
  const onChange = useCallback((value: Value, action: ActionTypes) => {}, []);

  const {
    isUsed: isOnInputChangeUsed,
    trackingFunction: usageTrackedOnInputChange,
  } = useFunctionUsageTracking<typeof onInputChange>(onInputChange);

  const {
    isUsed: isOnChangeUsed,
    trackingFunction: usageTrackedOnChange,
  } = useFunctionUsageTracking<typeof onChange>(onChange);

  return {
    recommendations:
      isOnInputChangeUsed && isOnChangeUsed
        ? recommendations
        : instrumentFailureOption,
    onInputChange: usageTrackedOnInputChange,
    onChange: usageTrackedOnChange,
    isLoading,
    error,
  };
};

export default useUserRecommendations;
