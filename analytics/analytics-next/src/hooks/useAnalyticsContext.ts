import { useContext } from 'react';

import {
  default as AnalyticsReactContext,
  AnalyticsReactContextInterface,
} from '@atlaskit/analytics-next-stable-react-context';

export const useAnalyticsContext = (): AnalyticsReactContextInterface => {
  return useContext(AnalyticsReactContext);
};
