import React from 'react';
import Switcher from '../primitives/themed-switcher';
import {
  Product,
  FeatureMap,
  DiscoverMoreCallback,
  TriggerXFlowCallback,
  WithRecommendationsFeatureFlags,
  JoinableSiteClickHandler,
  JoinableSiteClickHandlerData,
  SwitcherProductType,
  RenderAddOnData,
  CustomizeLinks,
} from '../../types';
import { mapResultsToSwitcherProps } from '../../common/utils/map-results-to-switcher-props';
import {
  JoinableSitesProvider,
  JoinableSitesDataProvider,
} from '../../cross-join/providers/joinable-sites-data-provider';
import { RecommendationsEngineProvider } from '../../cross-flow/providers/recommendations-provider';
import { WithTheme } from '../theme/types';
import { createResultComplete } from '../../common/providers/as-data-provider';
import { emptyCollaborationGraphRecentContainers } from '../../common/providers/instance-data-providers';
import { TrelloProductsProvider } from '../../common/providers/trello/products-provider';
import { addTrelloProduct } from '../../common/providers/trello/add-trello-product';
import {
  AvailableProductsDataProvider,
  AvailableProductsProvider,
} from '../../common/providers/products-data-provider';
import TrelloSignUpToJoinBanner from '../primitives/trello/sign-up-to-join';
import TrelloNewFriendsBanner from '../primitives/trello/new-friends-banner';
import { SwitcherItemType } from '../../common/utils/links';
import { getLoginUrl } from '../../common/utils/environment';
import {
  NavigationAnalyticsContext,
  analyticsAttributes,
} from '../../common/utils/analytics';

export type TrelloSwitcherProps = WithTheme &
  Partial<WithRecommendationsFeatureFlags> & {
    features: FeatureMap;
    triggerXFlow: TriggerXFlowCallback;
    onDiscoverMoreClicked: DiscoverMoreCallback;
    joinableSitesDataProvider?: JoinableSitesDataProvider;
    onJoinableSiteClicked?: JoinableSiteClickHandler;
    nonAaMastered?: boolean;
    defaultSignupEmail?: string;
    onClose?: () => void;
    availableProductsDataProvider?: AvailableProductsDataProvider;
    customizeLinks?: CustomizeLinks;
  };

const hasAtlassianProducts = (
  availableProducts: SwitcherItemType[],
): boolean => {
  return (
    availableProducts.filter(
      productLink => productLink.productType !== SwitcherProductType.TRELLO,
    ).length > 0
  );
};

const renderAddOn = (data: RenderAddOnData) => {
  const { availableProducts, joinableSiteLinks } = data;
  if (
    !hasAtlassianProducts(availableProducts) &&
    joinableSiteLinks.length > 0
  ) {
    return <TrelloNewFriendsBanner />;
  }
};

class TrelloSwitcher extends React.Component<TrelloSwitcherProps> {
  state = {
    showJoinSiteBanner: false,
    joinableSiteUrl: undefined,
    joinableSiteProductType: undefined,
    joinableSiteCloudId: '',
  };

  showSignupBanner = (data: JoinableSiteClickHandlerData) => {
    const { event, href, cloudId, productType, availableProducts } = data;
    const { defaultSignupEmail, onClose } = this.props;

    event.preventDefault();

    // Only show the sign up banner if the user doesn't already have available products
    // See https://hello.atlassian.net/wiki/spaces/PGT/pages/623194025/Non-AA+flow+known+issues for details
    if (!hasAtlassianProducts(availableProducts)) {
      this.setState({
        showJoinSiteBanner: true,
        joinableSiteUrl: href,
        joinableSiteProductType: productType,
        joinableSiteCloudId: cloudId,
      });
    } else {
      // Otherwise make sure that the user is logged in with correct email
      window.open(
        getLoginUrl(productType, undefined, href, defaultSignupEmail),
        '_blank',
      );
      onClose && onClose();
    }
  };

  render() {
    const {
      features,
      joinableSitesDataProvider,
      recommendationsFeatureFlags,
      defaultSignupEmail,
      onClose,
      availableProductsDataProvider,
      customizeLinks,
      triggerXFlow,
      onDiscoverMoreClicked,
    } = this.props;
    const {
      showJoinSiteBanner,
      joinableSiteUrl,
      joinableSiteProductType,
      joinableSiteCloudId,
    } = this.state;

    const dataProvider =
      availableProductsDataProvider || TrelloProductsProvider;

    return showJoinSiteBanner ? (
      <NavigationAnalyticsContext
        data={{
          ...analyticsAttributes({
            cloudId: joinableSiteCloudId,
          }),
        }}
      >
        <TrelloSignUpToJoinBanner
          defaultSignupEmail={defaultSignupEmail as string}
          continueUrl={(joinableSiteUrl as unknown) as string}
          productType={
            (joinableSiteProductType as unknown) as SwitcherProductType
          }
          onSignUpClicked={onClose}
        />
      </NavigationAnalyticsContext>
    ) : (
      <JoinableSitesProvider
        joinableSitesDataProvider={joinableSitesDataProvider}
      >
        {joinableSites => (
          <AvailableProductsProvider
            availableProductsDataProvider={dataProvider}
          >
            {availableProducts => (
              <RecommendationsEngineProvider
                featureFlags={recommendationsFeatureFlags}
              >
                {productRecommendations => {
                  const switcherLinks = mapResultsToSwitcherProps(
                    null,
                    {
                      availableProducts: addTrelloProduct(availableProducts),
                      joinableSites,
                      productRecommendations,
                      collaborationGraphRecentContainers: emptyCollaborationGraphRecentContainers,
                      managePermission: createResultComplete(false),
                      addProductsPermission: createResultComplete(false),
                      isXFlowEnabled: createResultComplete(true),
                    },
                    features,
                    onDiscoverMoreClicked,
                    triggerXFlow,
                    Product.TRELLO,
                    undefined,
                    undefined,
                    undefined,
                    customizeLinks,
                  );
                  return (
                    <Switcher
                      {...this.props}
                      {...switcherLinks}
                      onJoinableSiteClicked={
                        this.props.nonAaMastered
                          ? this.showSignupBanner
                          : undefined
                      }
                      renderAddOn={
                        this.props.nonAaMastered ? renderAddOn : undefined
                      }
                    />
                  );
                }}
              </RecommendationsEngineProvider>
            )}
          </AvailableProductsProvider>
        )}
      </JoinableSitesProvider>
    );
  }
}

export default TrelloSwitcher;
