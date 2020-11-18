import React from 'react';
import Switcher from '../primitives/themed-switcher';
import {
  CustomLinksProvider,
  MANAGE_HREF,
} from '../../common/providers/jira-data-providers';
import CommonDataProvider from '../../common/providers/common-data-provider';
import { mapResultsToSwitcherProps } from '../../common/utils/map-results-to-switcher-props';
import {
  FeatureMap,
  DiscoverMoreCallback,
  TriggerXFlowCallback,
  Product,
  WithRecommendationsFeatureFlags,
  ProviderResults,
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

type JiraSwitcherProps = WithTheme &
  Partial<WithRecommendationsFeatureFlags> & {
    cloudId: string;
    features: FeatureMap;
    triggerXFlow: TriggerXFlowCallback;
    onDiscoverMoreClicked: DiscoverMoreCallback;
    joinableSitesDataProvider?: JoinableSitesDataProvider;
    availableProductsDataProvider?: AvailableProductsDataProvider;
    slackDiscoveryClickHandler?: DiscoverMoreCallback;
  };

export default (props: JiraSwitcherProps) => (
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
                disableRecentContainers={props.features.disableRecentContainers}
                enableCollaborationGraphRecentContainers={
                  props.features.isCollaborationGraphRecentContainersEnabled
                }
                recommendationsFeatureFlags={{
                  isDiscoverSectionEnabled:
                    props.features.isDiscoverSectionEnabled,
                  ...props.recommendationsFeatureFlags,
                }}
              >
                {providerResults => {
                  const {
                    showManageLink,
                    ...switcherLinks
                  } = mapResultsToSwitcherProps(
                    props.cloudId,
                    {
                      ...providerResults,
                      availableProducts,
                      joinableSites,
                      customLinks,
                    },
                    props.features,
                    Product.JIRA,
                    undefined,
                    props.recommendationsFeatureFlags,
                    props.slackDiscoveryClickHandler,
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
