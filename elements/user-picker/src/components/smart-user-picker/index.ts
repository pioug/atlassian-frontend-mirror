/**
 * Please use AK/SUP instead
 * @deprecated
 */
export { default as SmartUserPicker, hydrateDefaultValues } from './components';
export { getUserRecommendations } from './service';
export type {
  SupportedProduct,
  RecommendationRequest,
  Props as SmartUserPickerProps,
  State as SmartUserPickerState,
  SmartProps,
} from './components';

export { setSmartUserPickerEnv } from './config';
