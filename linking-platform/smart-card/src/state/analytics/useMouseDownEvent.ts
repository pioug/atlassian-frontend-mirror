import { useCallback } from 'react';
import { useAnalyticsEvents } from '@atlaskit/analytics-next';

import { fireLinkClickedEvent } from '../../utils/analytics/click';

const useMouseDownEvent = <T extends React.MouseEventHandler>(
  onMouseDown?: T,
) => {
  const { createAnalyticsEvent } = useAnalyticsEvents();

  return useCallback(
    (event: Parameters<T>[0]) => {
      onMouseDown?.(event);

      // ignore left clicks
      // these would be handled by `onClick` handler instead
      if (event.button !== 0) {
        fireLinkClickedEvent(createAnalyticsEvent)(event);
      }
    },
    [onMouseDown, createAnalyticsEvent],
  );
};

export default useMouseDownEvent;
