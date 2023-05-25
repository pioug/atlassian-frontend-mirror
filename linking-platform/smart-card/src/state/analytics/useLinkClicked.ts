import { useCallback } from 'react';
import { useAnalyticsEvents } from '@atlaskit/analytics-next';

import { fireLinkClickedEvent } from '../../utils/analytics/click';

export enum ClickButton {
  Left = 0,
  Middle = 1,
  Right = 2,
}

export const useLinkClicked = <T extends React.MouseEventHandler>(
  /**
   * Handler to
   */
  handler?: T,
  /**
   * Filter which mouse events should trigger the link clicked event
   */
  predicate?: (event: React.MouseEvent) => boolean,
) => {
  const { createAnalyticsEvent } = useAnalyticsEvents();

  return useCallback(
    (...args: Parameters<T>) => {
      const [event] = args;
      handler?.apply(null, args);
      if (!predicate || predicate?.(event)) {
        fireLinkClickedEvent(createAnalyticsEvent)(event);
      }
    },
    [handler, predicate, createAnalyticsEvent],
  );
};

const isNotLeftClick = (event: React.MouseEvent) => event.button !== 0;

export const useMouseDownEvent = <T extends React.MouseEventHandler>(
  onMouseDown?: T,
) => {
  return useLinkClicked(onMouseDown, isNotLeftClick);
};
