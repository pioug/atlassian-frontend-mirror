import React from 'react';

export interface AnalyticsReactContextInterface {
  getAtlaskitAnalyticsContext: null | (() => any[]);
  getAtlaskitAnalyticsEventHandlers: null | (() => any[]);
}

export const AnalyticsReactContext = React.createContext<
  AnalyticsReactContextInterface
>({
  getAtlaskitAnalyticsContext: null,
  getAtlaskitAnalyticsEventHandlers: null,
});
