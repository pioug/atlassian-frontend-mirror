import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import debounce from 'lodash/debounce';
import { v4 as uuid } from 'uuid';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import {
  EntityType,
  fetchUserRecommendations,
  UserSearchItem,
} from '@atlaskit/smart-common';

import type { UseUserRecommendationsProps } from '../../types';
import useFunctionUsageTracking from '../use-function-usage-tracking';

import {
  createDefaultAttributes,
  findUserPosition,
  fireUserSelectedEvent,
} from './analytics';
import { UsersFetchedUfoExperience } from './ufoExperiences';

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

  const renderId = useRef<string>('');
  const sessionId = useRef<string>('');
  const currentQuery = useRef<string>('');

  const { createAnalyticsEvent } = useAnalyticsEvents();

  const getAnalyticsAttributes = useCallback(
    () => ({
      ...createDefaultAttributes(
        {
          fieldId,
          objectId,
          containerId,
          childObjectId,
          preload,
          includeTeams,
          productKey,
          principalId,
          tenantId,
          maxNumberOfResults,
        },
        renderId.current,
        sessionId.current,
        currentQuery.current,
      ),
    }),
    [
      childObjectId,
      containerId,
      fieldId,
      includeTeams,
      maxNumberOfResults,
      objectId,
      preload,
      principalId,
      productKey,
      tenantId,
    ],
  );

  const fetchRecommendations = useCallback(
    async (query?: string) => {
      setIsLoading(true);
      // restart session
      sessionId.current = uuid();

      UsersFetchedUfoExperience.getInstance(fieldId).start();

      try {
        const recommendedUsersResult = await fetchUserRecommendations({
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
            sessionId: sessionId.current,
          },
          includeUsers,
          includeGroups,
          includeTeams,
          maxNumberOfResults,
          searchQuery: cpusSearchQuery,
          query,
        });
        currentQuery.current = query ?? '';
        UsersFetchedUfoExperience.getInstance(fieldId).success({
          metadata: {
            ...getAnalyticsAttributes(),
            loadedUsersSize: recommendedUsersResult.length,
          },
        });
        setRecommendations(recommendedUsersResult);
      } catch (error) {
        UsersFetchedUfoExperience.getInstance(fieldId).failure({
          metadata: getAnalyticsAttributes(),
        });
        setError(error);
      }
      setIsLoading(false);
    },
    [
      baseUrl,
      childObjectId,
      containerId,
      objectId,
      principalId,
      productAttributes,
      productKey,
      fieldId,
      tenantId,
      includeUsers,
      includeGroups,
      includeTeams,
      maxNumberOfResults,
      cpusSearchQuery,
      getAnalyticsAttributes,
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

  const onInputChange = useCallback(
    (query?: string) => {
      debouncedFetchRecommendations(query ?? '');
    },
    [debouncedFetchRecommendations],
  );

  const onUserSelect = useCallback(
    (userId: string) => {
      fireUserSelectedEvent(createAnalyticsEvent, {
        ...getAnalyticsAttributes(),
        selectedUser: userId,
        loadedUsersSize: recommendations.length,
        position: findUserPosition(recommendations, userId),
      });
    },
    [createAnalyticsEvent, getAnalyticsAttributes, recommendations],
  );

  const {
    isUsed: isOnInputChangeUsed,
    trackingFunction: usageTrackedOnInputChange,
  } = useFunctionUsageTracking<typeof onInputChange>(onInputChange);

  const {
    isUsed: isOnUserSelectUsed,
    trackingFunction: usageTrackedOnUserSelect,
  } = useFunctionUsageTracking<typeof onUserSelect>(onUserSelect);

  useEffect(() => {
    renderId.current = uuid();
  }, []);

  return {
    recommendations:
      isOnInputChangeUsed && isOnUserSelectUsed
        ? recommendations
        : instrumentFailureOption,
    triggerSearchFactory: usageTrackedOnInputChange,
    selectUserFactory: usageTrackedOnUserSelect,
    isLoading,
    error,
  };
};

export default useUserRecommendations;
