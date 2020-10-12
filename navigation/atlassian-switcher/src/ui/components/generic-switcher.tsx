import React from 'react';
import Switcher from '../primitives/themed-switcher';
import CommonDataProvider from '../../common/providers/common-data-provider';
import {
  Product,
  FeatureMap,
  DiscoverMoreCallback,
  TriggerXFlowCallback,
  WithRecommendationsFeatureFlags,
} from '../../types';
import { mapResultsToSwitcherProps } from '../../common/utils/map-results-to-switcher-props';
import {
  AvailableProductsProvider,
  AvailableProductsDataProvider,
} from '../../common/providers/products-data-provider';
import {
  JoinableSitesProvider,
  JoinableSitesDataProvider,
} from '../../cross-join/providers/joinable-sites-data-provider';
import { WithTheme } from '../theme/types';

export type GenericSwitcherProps = WithTheme &
  Partial<WithRecommendationsFeatureFlags> & {
    cloudId?: string;
    features: FeatureMap;
    triggerXFlow: TriggerXFlowCallback;
    onDiscoverMoreClicked: DiscoverMoreCallback;
    product: Exclude<Product, Product.JIRA | Product.CONFLUENCE>;
    availableProductsDataProvider?: AvailableProductsDataProvider;
    joinableSitesDataProvider?: JoinableSitesDataProvider;
    adminUrl?: string;
  };

export default (props: GenericSwitcherProps) => (
  <JoinableSitesProvider
    joinableSitesDataProvider={props.joinableSitesDataProvider}
  >
    {joinableSites => (
      <AvailableProductsProvider
        availableProductsDataProvider={props.availableProductsDataProvider}
      >
        {availableProducts => (
          <CommonDataProvider
            cloudId={props.cloudId}
            disableRecentContainers={props.features.disableRecentContainers}
            recommendationsFeatureFlags={{
              ...props.recommendationsFeatureFlags,
            }}
          >
            {providerResults => {
              const switcherLinks = mapResultsToSwitcherProps(
                props.cloudId,
                { ...providerResults, availableProducts, joinableSites },
                props.features,
                props.product,
                props.adminUrl,
              );
              return <Switcher {...props} {...switcherLinks} />;
            }}
          </CommonDataProvider>
        )}
      </AvailableProductsProvider>
    )}
  </JoinableSitesProvider>
);
