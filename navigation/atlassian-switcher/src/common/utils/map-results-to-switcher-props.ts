import {
  getAvailableProductLinks,
  getCustomLinkItems,
  getProvisionedProducts,
  getRecentLinkItemsCollaborationGraph,
  SwitcherItemType,
} from './links';
import {
  hasLoaded,
  isComplete,
  isError,
  Status,
} from '../providers/as-data-provider';
import {
  FeatureMap,
  Product,
  ProviderResults,
  SyntheticProviderResults,
  RecommendationsFeatureFlags,
  DiscoverMoreCallback,
  CustomizeLinks,
  MapUrl,
  GetExtendedAnalyticsAttributes,
  TriggerXFlowCallback,
} from '../../types';
import { createCollector } from './create-collector';
import {
  collectAdminLinks,
  collectAdminLinksNext,
} from '../../admin/utils/admin-link-collector';
import {
  collectDiscoverSectionLinks,
  collectSuggestedLinks,
} from '../../cross-flow/utils/cross-flow-link-collector';
import { collectJoinableSiteLinks } from '../../cross-join/utils/cross-join-link-collector';
import {
  UserSiteDataErrorReason,
  UserSiteDataError,
} from './errors/user-site-data-error';
import { getIsDiscoverMoreClickable } from './get-is-discover-more-clickable';

function collectAvailableProductLinks(
  cloudId: string | null | undefined,
  mapUrl: MapUrl,
  features: {
    jwmRebrandEnabled: boolean;
  },
  availableProducts?: ProviderResults['availableProducts'],
): SwitcherItemType[] | undefined {
  if (availableProducts) {
    if (isError(availableProducts)) {
      throw availableProducts.error;
    }
    if (isComplete(availableProducts)) {
      return getAvailableProductLinks(
        availableProducts.data,
        cloudId,
        mapUrl,
        features,
      );
    }
    return;
  }
  return;
}

function collectCanManageLinks(
  managePermission: ProviderResults['managePermission'],
) {
  if (isComplete(managePermission)) {
    return managePermission.data;
  }
}
function recentLinksLoadedSuccessfully(
  userSiteData: SyntheticProviderResults['userSiteData'],
  collaborationGraphRecentContainers: ProviderResults['collaborationGraphRecentContainers'],
): boolean {
  return (
    !(isError(collaborationGraphRecentContainers) || isError(userSiteData)) &&
    isComplete(collaborationGraphRecentContainers) &&
    isComplete(userSiteData)
  );
}

function collectRecentLinks(
  userSiteData: SyntheticProviderResults['userSiteData'],
  collaborationGraphRecentContainers: ProviderResults['collaborationGraphRecentContainers'],
) {
  if (
    recentLinksLoadedSuccessfully(
      userSiteData,
      collaborationGraphRecentContainers,
    )
  ) {
    if (collaborationGraphRecentContainers.data?.collaborationGraphEntities) {
      return getRecentLinkItemsCollaborationGraph(
        collaborationGraphRecentContainers.data.collaborationGraphEntities,
        userSiteData.data!.currentSite,
      );
    }
  }

  return [];
}

function collectCustomLinks(
  customLinks: ProviderResults['customLinks'],
  userSiteData: SyntheticProviderResults['userSiteData'],
) {
  if (customLinks === undefined || isError(userSiteData)) {
    return [];
  }

  if (isComplete(customLinks) && isComplete(userSiteData)) {
    return getCustomLinkItems(customLinks.data, userSiteData.data.currentSite);
  }
}

function isTenantless(product: Product) {
  return [Product.BITBUCKET, Product.TRELLO].includes(product);
}

const asProvisionedProductsResult = (
  availableProductsProvider: ProviderResults['availableProducts'],
): SyntheticProviderResults['provisionedProducts'] => {
  switch (availableProductsProvider.status) {
    case Status.LOADING: // intentional fallthrough
    case Status.ERROR:
      return availableProductsProvider;
    case Status.COMPLETE:
      return {
        status: Status.COMPLETE,
        data: getProvisionedProducts(availableProductsProvider.data),
      };
  }
};

function asUserSiteDataProviderResult(
  availableProductsProvider: ProviderResults['availableProducts'],
  cloudId: string | null | undefined,
  product: Product | null | undefined,
): SyntheticProviderResults['userSiteData'] {
  switch (availableProductsProvider.status) {
    case Status.LOADING: // intentional fallthrough
    case Status.ERROR:
      return availableProductsProvider;
    case Status.COMPLETE:
      if (availableProductsProvider.data.sites.length === 0) {
        const reason = availableProductsProvider.data.isPartial
          ? UserSiteDataErrorReason.APS_PARTIAL_EMPTY_RESULT
          : UserSiteDataErrorReason.APS_EMPTY_RESULT;
        return {
          status: Status.ERROR,
          data: null,
          error: new UserSiteDataError(
            reason,
            `Available products returned an empty list`,
          ),
        };
      }
      const site = availableProductsProvider.data.sites.find(
        (site) =>
          (cloudId && site.cloudId === cloudId) ||
          (product &&
            isTenantless(product) &&
            isTenantless(site.cloudId as Product)),
      );

      if (!site) {
        return {
          status: Status.ERROR,
          data: null,
          error: new UserSiteDataError(
            UserSiteDataErrorReason.APS_NO_SITE_MATCH,
            `could not find site in availableProducts for cloudId ${cloudId}`,
          ),
        };
      }
      return {
        status: Status.COMPLETE,
        data: {
          currentSite: {
            url: site.url,
            products: site.availableProducts,
          },
        },
      };
  }
}

export function mapResultsToSwitcherProps(
  cloudId: string | null | undefined,
  results: ProviderResults,
  features: FeatureMap,
  onDiscoverMoreClicked: DiscoverMoreCallback,
  triggerXFlow: TriggerXFlowCallback,
  product?: Product,
  adminUrl?: string,
  recommendationsFeatureFlags?: RecommendationsFeatureFlags,
  slackDiscoveryClickHandler?: DiscoverMoreCallback,
  customizeLinks?: CustomizeLinks,
) {
  const collect = createCollector();

  const {
    availableProducts,
    joinableSites,
    isXFlowEnabled,
    managePermission,
    addProductsPermission,
    customLinks,
    productRecommendations,
    collaborationGraphRecentContainers,
  } = results;

  const userSiteData = asUserSiteDataProviderResult(
    availableProducts,
    cloudId,
    product,
  );
  // [FD-15975]: Remove after the FF is rolled out to 100%.
  const act959Enabled = Boolean(
    availableProducts.data?.unstableFeatures?.act959Enabled,
  );
  const jwmRebrandEnabled = Boolean(
    availableProducts.data?.unstableFeatures?.jwmRebrandEnabled,
  );
  const provisionedProducts = asProvisionedProductsResult(availableProducts);
  const hasLoadedAvailableProducts = hasLoaded(availableProducts);
  const hasLoadedAdminLinks =
    hasLoaded(managePermission) && hasLoaded(addProductsPermission);
  const hasLoadedSuggestedProducts = features.xflow
    ? hasLoaded(productRecommendations) && hasLoaded(isXFlowEnabled)
    : true;

  const isDiscoverMoreClickable = getIsDiscoverMoreClickable(
    onDiscoverMoreClicked,
    triggerXFlow,
  );

  const hasLoadedDiscoverSection =
    isDiscoverMoreClickable &&
    hasLoadedAvailableProducts &&
    hasLoadedSuggestedProducts &&
    hasLoadedAdminLinks;

  const hasLoadedJoinableSites = hasLoaded(joinableSites);

  let mapUrl: MapUrl = (url) => url;
  let getExtendedAnalyticsAttributes: GetExtendedAnalyticsAttributes = () => ({});
  if (customizeLinks) {
    const originCustomLinks = customizeLinks();
    mapUrl = originCustomLinks.mapUrl;
    getExtendedAnalyticsAttributes =
      originCustomLinks.getExtendedAnalyticsAttributes;
  }
  return {
    getExtendedAnalyticsAttributes,
    licensedProductLinks: collect(
      collectAvailableProductLinks(
        cloudId,
        mapUrl,
        { jwmRebrandEnabled },
        availableProducts,
      ),
      [],
    ),
    suggestedProductLinks: features.xflow
      ? collect(
          collectSuggestedLinks(
            provisionedProducts,
            productRecommendations,
            isXFlowEnabled,
            joinableSites,
          ),
          [],
        )
      : [],
    fixedLinks: [],
    adminLinks: features.isTrustedAdminUIDeprecationEnabled
      ? collect(collectAdminLinksNext(managePermission, adminUrl), [])
      : collect(
          collectAdminLinks(managePermission, addProductsPermission, adminUrl),
          [],
        ),
    joinableSiteLinks: collect(collectJoinableSiteLinks(joinableSites), []),
    discoverSectionLinks: hasLoadedDiscoverSection
      ? collect(
          collectDiscoverSectionLinks(
            managePermission,
            addProductsPermission,
            features.isEmceeLinkEnabled,
            product,
            recommendationsFeatureFlags,
            features.isSlackDiscoveryEnabled,
            slackDiscoveryClickHandler,
          ),
          [],
        )
      : [],
    recentLinks: collect(
      collectRecentLinks(userSiteData, collaborationGraphRecentContainers),
      [],
    ),
    customLinks: collect(collectCustomLinks(customLinks, userSiteData), []),
    showStartLink: act959Enabled && product !== Product.START,
    showNewHeading: act959Enabled,
    showManageLink:
      !features.disableCustomLinks &&
      collect(collectCanManageLinks(managePermission), false),
    hasLoaded:
      hasLoadedAvailableProducts &&
      hasLoadedAdminLinks &&
      hasLoadedSuggestedProducts &&
      hasLoadedJoinableSites,
    hasLoadedCritical: hasLoadedAvailableProducts,
    hasLoadedInstanceProviders:
      hasLoaded(collaborationGraphRecentContainers) &&
      customLinks &&
      hasLoaded(customLinks) &&
      hasLoaded(userSiteData),
    rawProviderResults: {
      availableProducts,
      joinableSites,
      productRecommendations,
      isXFlowEnabled,
      addProductsPermission,
      managePermission,
      collaborationGraphRecentContainers,
      customLinks,
      userSiteData,
      provisionedProducts,
    },
    features,
    isDiscoverMoreClickable,
  };
}
