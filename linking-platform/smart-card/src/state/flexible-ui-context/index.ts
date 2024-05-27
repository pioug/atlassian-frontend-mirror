import { useContext, createContext } from 'react';
import type {
  FlexibleAnalyticsContextType,
  FlexibleUiDataContext,
} from './types';
import { type FlexibleUiOptions } from '../../view/FlexibleCard/types';

/**
 * This provides the data that will be used by Smart Links Flexible UI to populate it's
 * underlying elements.
 */
export const FlexibleUiContext = createContext<
  FlexibleUiDataContext | undefined
>(undefined);

export const useFlexibleUiContext = () => useContext(FlexibleUiContext);

/**
 * This provides the data that will be used by Smart Links Flexible UI to populate it's
 * underlying elements.
 */
export const FlexibleUiAnalyticsContext = createContext<
  FlexibleAnalyticsContextType | undefined
>(undefined);

export const useFlexibleUiAnalyticsContext = () =>
  useContext(FlexibleUiAnalyticsContext);

/**
 * This provides the ui options that will be used by Smart Links Flexible UI
 * to render its underlying elements.
 */
export const FlexibleUiOptionContext = createContext<
  FlexibleUiOptions | undefined
>(undefined);

export const useFlexibleUiOptionContext = () =>
  useContext(FlexibleUiOptionContext);
