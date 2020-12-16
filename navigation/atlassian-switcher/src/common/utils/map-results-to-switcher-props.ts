import {
  getAvailableProductLinks,
  getCustomLinkItems,
  getProvisionedProducts,
  getRecentLinkItems,
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
} from '../../types';
import { createCollector } from './create-collector';
import { collectAdminLinks } from '../../admin/utils/admin-link-collector';
import {
  collectDiscoverSectionLinks,
  collectFixedProductLinks,
  collectSuggestedLinks,
} from '../../cross-flow/utils/cross-flow-link-collector';
import { collectJoinableSiteLinks } from '../../cross-join/utils/cross-join-link-collector';

function collectAvailableProductLinks(
  cloudId: string | null | undefined,
  features: {
    isMystiqueEnabled: boolean;
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
  recentContainers: ProviderResults['recentContainers'],
  userSiteData: SyntheticProviderResults['userSiteData'],
  collaborationGraphRecentContainers: ProviderResults['collaborationGraphRecentContainers'],
): boolean {
  return (
    !(
      isError(collaborationGraphRecentContainers) ||
      isError(recentContainers) ||
      isError(userSiteData)
    ) &&
    isComplete(recentContainers) &&
    isComplete(collaborationGraphRecentContainers) &&
    isComplete(userSiteData)
  );
}

function collectRecentLinks(
  recentContainers: ProviderResults['recentContainers'],
  userSiteData: SyntheticProviderResults['userSiteData'],
  collaborationGraphRecentContainers: ProviderResults['collaborationGraphRecentContainers'],
) {
  if (
    recentLinksLoadedSuccessfully(
      recentContainers,
      userSiteData,
      collaborationGraphRecentContainers,
    )
  ) {
    if (collaborationGraphRecentContainers.data!.collaborationGraphEntities) {
      return getRecentLinkItemsCollaborationGraph(
        collaborationGraphRecentContainers.data!.collaborationGraphEntities,
        userSiteData.data!.currentSite,
      );
    }
    if (recentContainers.data!.data) {
      return getRecentLinkItems(
        recentContainers.data!.data,
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
      const site = availableProductsProvider.data.sites.find(
        site =>
          (cloudId && site.cloudId === cloudId) ||
          (product &&
            isTenantless(product) &&
            isTenantless(site.cloudId as Product)),
      );

      if (!site) {
        return {
          status: Status.ERROR,
          data: null,
          error: new Error(
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
  product?: Product,
  adminUrl?: string,
  recommendationsFeatureFlags?: RecommendationsFeatureFlags,
  slackDiscoveryClickHandler?: DiscoverMoreCallback,
) {
  const collect = createCollector();

  const {
    availableProducts,
    joinableSites,
    isXFlowEnabled,
    managePermission,
    addProductsPermission,
    customLinks,
    recentContainers,
    productRecommendations,
    collaborationGraphRecentContainers,
  } = results;

  const userSiteData = asUserSiteDataProviderResult(
    availableProducts,
    cloudId,
    product,
  );
  // [FD-15974]: Remove after feature flag is rolled out to 100%
  const isMystiqueEnabled = true;
  // [FD-15975]: Remove after the FF is rolled out to 100%.
  const act959Enabled = Boolean(
    availableProducts.data?.unstableFeatures?.act959Enabled,
  );
  const provisionedProducts = asProvisionedProductsResult(availableProducts);
  const hasLoadedAvailableProducts = hasLoaded(availableProducts);
  const hasLoadedAdminLinks =
    hasLoaded(managePermission) && hasLoaded(addProductsPermission);
  const hasLoadedSuggestedProducts = features.xflow
    ? hasLoaded(productRecommendations) && hasLoaded(isXFlowEnabled)
    : true;
  const hasLoadedDiscoverSection =
    features.isDiscoverSectionEnabled &&
    hasLoadedAvailableProducts &&
    hasLoadedSuggestedProducts &&
    hasLoadedAdminLinks;

  const hasLoadedJoinableSites = hasLoaded(joinableSites);

  return {
    licensedProductLinks: collect(
      collectAvailableProductLinks(
        cloudId,
        {
          isMystiqueEnabled,
        },
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
            {
              isDiscoverSectionEnabled: features.isDiscoverSectionEnabled,
              isDefaultEditionFreeExperimentEnabled:
                features.isDefaultEditionFreeExperimentEnabled,
              isMystiqueEnabled,
            },
          ),
          [],
        )
      : [],
    fixedLinks: !features.isDiscoverSectionEnabled
      ? collect(
          collectFixedProductLinks(features.isDiscoverMoreForEveryoneEnabled),
          [],
        )
      : [],
    adminLinks: collect(
      collectAdminLinks(
        managePermission,
        addProductsPermission,
        features.isDiscoverMoreForEveryoneEnabled,
        features.isEmceeLinkEnabled,
        product,
        features.isDiscoverSectionEnabled,
        adminUrl,
      ),
      [],
    ),
    joinableSiteLinks: collect(
      collectJoinableSiteLinks(joinableSites, { isMystiqueEnabled }),
      [],
    ),
    discoverSectionLinks: hasLoadedDiscoverSection
      ? collect(
          collectDiscoverSectionLinks(
            managePermission,
            addProductsPermission,
            features.isDiscoverMoreForEveryoneEnabled,
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
      collectRecentLinks(
        recentContainers,
        userSiteData,
        collaborationGraphRecentContainers,
      ),
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
      hasLoaded(recentContainers) &&
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
      recentContainers,
      collaborationGraphRecentContainers,
      customLinks,
      userSiteData,
      provisionedProducts,
    },
    features,
  };
}
