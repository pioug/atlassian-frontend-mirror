import React, { useCallback, useMemo } from 'react';

import { default as AnalyticsReactContext } from '@atlaskit/analytics-next-stable-react-context';

import { useAnalyticsContext } from '../../hooks/useAnalyticsContext';
import { useTrackedRef } from '../../hooks/useTrackedRef';

import { AnalyticsContextFunction } from './types';

const AnalyticsContext: AnalyticsContextFunction = ({ data, children }) => {
  const dataRef = useTrackedRef(data);
  const analyticsContext = useAnalyticsContext();

  const getAtlaskitAnalyticsContext = useCallback(() => {
    return [...analyticsContext.getAtlaskitAnalyticsContext(), dataRef.current];
  }, [analyticsContext, dataRef]);

  const value = useMemo(
    () => ({
      getAtlaskitAnalyticsContext,
      getAtlaskitAnalyticsEventHandlers:
        analyticsContext.getAtlaskitAnalyticsEventHandlers,
    }),
    [analyticsContext, getAtlaskitAnalyticsContext],
  );

  return (
    <AnalyticsReactContext.Provider value={value}>
      {children}
    </AnalyticsReactContext.Provider>
  );
};

export default AnalyticsContext;
