import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import debounce from 'lodash/debounce';
import memoizeOne from 'memoize-one';
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
  const [renderId] = useState<string>(() => uuid());

  const sessionId = useRef<string>('');
  const currentQuery = useRef<string>('');
  const lastAbortController = useRef<AbortController | null>();

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
        renderId,
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
      renderId,
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
        if (lastAbortController.current) {
          lastAbortController.current?.abort();
        }
        // in case there are still IE users, check AbortController before init,
        // IE has no timeout applied on fetch since AbortController isn't available
        const currentController =
          typeof AbortController !== 'undefined' ? new AbortController() : null;
        lastAbortController.current = currentController;

        const recommendedUsersResult = await fetchUserRecommendations(
          {
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
          },
          currentController?.signal,
        );
        currentQuery.current = query ?? '';
        UsersFetchedUfoExperience.getInstance(fieldId).success({
          metadata: {
            ...getAnalyticsAttributes(),
            loadedUsersSize: recommendedUsersResult.length,
          },
        });
        setRecommendations(recommendedUsersResult);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          // Request aborted client-side
          UsersFetchedUfoExperience.getInstance(fieldId).abort();
          // return early to prevent disabling isLoading
          return;
        } else {
          UsersFetchedUfoExperience.getInstance(fieldId).failure({
            metadata: getAnalyticsAttributes(),
          });
          setError(error);
        }
      }
      setIsLoading(false);
      // clear abort controller
      lastAbortController.current = undefined;
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

  const memoizedDebouncedFetchRecommendations = useMemo(
    () => memoizeOne(debounce(fetchRecommendations, debounceTimeMs)),
    [fetchRecommendations, debounceTimeMs],
  );

  useEffect(() => {
    if (preload) {
      memoizedDebouncedFetchRecommendations('');
    }
  }, [preload, memoizedDebouncedFetchRecommendations]);

  const onInputChange = useCallback(
    (query?: string) => {
      memoizedDebouncedFetchRecommendations(query ?? '');
    },
    [memoizedDebouncedFetchRecommendations],
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
