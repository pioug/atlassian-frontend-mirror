import React, { useCallback, useMemo } from 'react';

import { default as AnalyticsReactContext } from '@atlaskit/analytics-next-stable-react-context';

import { UIAnalyticsEventHandler } from '../../events/UIAnalyticsEvent';
import { useAnalyticsContext } from '../../hooks/useAnalyticsContext';
import { useTrackedRef } from '../../hooks/useTrackedRef';

import { AnalyticsListenerFunction } from './types';

const AnalyticsListener: AnalyticsListenerFunction = ({
  children,
  channel,
  onEvent,
}) => {
  const analyticsContext = useAnalyticsContext();
  const onEventRef = useTrackedRef(onEvent);
  const channelRef = useTrackedRef(channel);

  const getAtlaskitAnalyticsEventHandlers = useCallback(() => {
    const thisHandler: UIAnalyticsEventHandler = (event, eventChannel) => {
      if (channelRef.current === '*' || channelRef.current === eventChannel) {
        onEventRef.current(event, eventChannel);
      }
    };

    return [
      ...analyticsContext.getAtlaskitAnalyticsEventHandlers(),
      thisHandler,
    ];
  }, [analyticsContext, channelRef, onEventRef]);

  const value = useMemo(() => {
    return {
      getAtlaskitAnalyticsEventHandlers,
      getAtlaskitAnalyticsContext: analyticsContext.getAtlaskitAnalyticsContext,
    };
  }, [analyticsContext, getAtlaskitAnalyticsEventHandlers]);

  return (
    <AnalyticsReactContext.Provider value={value}>
      {children}
    </AnalyticsReactContext.Provider>
  );
};

export default AnalyticsListener;
