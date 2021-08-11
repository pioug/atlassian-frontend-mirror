export { SwitchToTooltipText } from './common/utils/messages';
export { AtlassianSwitcherLoader as default } from './ui/components/loaders';
export { default as AtlassianSwitcherPrefetchTrigger } from './ui/components/prefetch-trigger';

export { createCustomTheme } from './ui/theme/theme-builder';
export {
  createAvailableProductsProvider,
  createJoinableSitesProvider,
  fetchProductRecommendations,
} from './create-custom-provider';
export { defaultAvailableProductsFetch } from './common/providers/default-available-products-provider';
export { createProviderWithCustomFetchData } from './common/providers/create-data-provider';
export type {
  DataProvider,
  ExportedDataProvider,
} from './common/providers/create-data-provider';
export type { TriggerXFlowCallback, DiscoverMoreCallback } from './types';
export { SwitcherProductType } from './types';
