import { useEffect, useMemo, useRef } from 'react';

import { useDebounce } from 'use-debounce';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';

import { ANALYTICS_CHANNEL } from '../../../../../common/constants';
import { LinkSearchListItemData } from '../../../../../common/types';
import createEventPayload from '../../../../../common/utils/analytics/analytics.codegen';

const DEBOUNCE_MS = 400;

export const useTrackResultsShown = (
  isLoading: boolean,
  items?: LinkSearchListItemData[] | null | undefined,
  hasSearchTerm?: boolean,
) => {
  const { createAnalyticsEvent } = useAnalyticsEvents();

  const hasSearchTermRef = useRef(hasSearchTerm);
  // Using ref so that not required in the dependency array
  // Analytics should be entirely dependent on change of items being viewed
  useEffect(() => {
    hasSearchTermRef.current = hasSearchTerm;
  }, [hasSearchTerm]);

  // Filters isLoading/items to only return the array of items if no longer loading more items
  // Loading state IS a factor here because some tabs will
  // load intermediate results whilst loading additional results (Atlassian tab)
  // Considered to only have "shown" results once we are in a final state (no longer loading)
  const finalItems = useMemo(
    () => (!isLoading ? items : null),
    [isLoading, items],
  );

  // Because Atlassian tab resolves intermediate results on every keystroke (may never be loading)
  // Debounce the items so that we only consider the results to have been shown
  // after they have been stable for DEBOUNCE_MS
  const [debouncedItems] = useDebounce(finalItems, DEBOUNCE_MS);

  useEffect(() => {
    if (debouncedItems) {
      const event = !hasSearchTermRef.current
        ? 'ui.searchResults.shown.preQuerySearchResults'
        : 'ui.searchResults.shown.postQuerySearchResults';

      createAnalyticsEvent(
        createEventPayload(event, {
          resultCount: debouncedItems.length,
        }),
      ).fire(ANALYTICS_CHANNEL);
    }
  }, [debouncedItems, createAnalyticsEvent]);
};
