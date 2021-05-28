import React from 'react';
import Switcher from '../primitives/themed-switcher';
import {
  CustomLinksProvider,
  MANAGE_HREF,
} from '../../common/providers/confluence-data-providers';
import CommonDataProvider from '../../common/providers/common-data-provider';
import { mapResultsToSwitcherProps } from '../../common/utils/map-results-to-switcher-props';
import {
  FeatureMap,
  RecommendationsFeatureFlags,
  DiscoverMoreCallback,
  TriggerXFlowCallback,
  Product,
  ProviderResults,
  CustomizeLinks,
} from '../../types';
import {
  JoinableSitesProvider,
  JoinableSitesDataProvider,
} from '../../cross-join/providers/joinable-sites-data-provider';
import {
  AvailableProductsProvider,
  AvailableProductsDataProvider,
} from '../../common/providers/products-data-provider';
import { WithTheme } from '../theme/types';

type ConfluenceSwitcherProps = WithTheme & {
  cloudId: string;
  features: FeatureMap;
  triggerXFlow: TriggerXFlowCallback;
  onDiscoverMoreClicked: DiscoverMoreCallback;
  recommendationsFeatureFlags?: RecommendationsFeatureFlags;
  joinableSitesDataProvider?: JoinableSitesDataProvider;
  availableProductsDataProvider?: AvailableProductsDataProvider;
  slackDiscoveryClickHandler?: DiscoverMoreCallback;
  customizeLinks?: CustomizeLinks;
};

export default (props: ConfluenceSwitcherProps) => (
  <JoinableSitesProvider
    joinableSitesDataProvider={props.joinableSitesDataProvider}
  >
    {joinableSites => (
      <CustomLinksProvider
        disableCustomLinks={props.features.disableCustomLinks}
      >
        {customLinks => (
          <AvailableProductsProvider
            availableProductsDataProvider={props.availableProductsDataProvider}
          >
            {(availableProducts: ProviderResults['availableProducts']) => (
              <CommonDataProvider
                cloudId={props.cloudId}
                enableRecentContainers={props.features.enableRecentContainers}
              >
                {providerResults => {
                  const {
                    showManageLink,
                    ...switcherLinks
                  } = mapResultsToSwitcherProps(
                    props.cloudId,
                    {
                      ...providerResults,
                      customLinks,
                      availableProducts,
                      joinableSites,
                    },
                    props.features,
                    props.onDiscoverMoreClicked,
                    props.triggerXFlow,
                    Product.CONFLUENCE,
                    undefined,
                    undefined,
                    props.slackDiscoveryClickHandler,
                    props.customizeLinks,
                  );

                  return (
                    <Switcher
                      {...props}
                      {...switcherLinks}
                      manageLink={showManageLink ? MANAGE_HREF : undefined}
                    />
                  );
                }}
              </CommonDataProvider>
            )}
          </AvailableProductsProvider>
        )}
      </CustomLinksProvider>
    )}
  </JoinableSitesProvider>
);
