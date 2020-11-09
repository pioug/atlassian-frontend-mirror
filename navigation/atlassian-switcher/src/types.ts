import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { WithTheme } from './ui/theme/types';
import { AvailableProductsDataProvider } from './common/providers/products-data-provider';
import { JoinableSitesDataProvider } from './cross-join/providers/joinable-sites-data-provider';
import { SwitcherItemType } from './common/utils/links';
import { ReactNode } from 'react';
import { ProviderResult } from './common/providers/as-data-provider';

export interface TriggerXFlowCallback {
  (
    productKey: string,
    sourceComponent: string,
    event: any,
    analyticsEvent: UIAnalyticsEvent,
  ): void;
}
export interface DiscoverMoreCallback {
  (event: any, analyticsEvent: UIAnalyticsEvent, key?: string): void;
}

export interface WithCloudId {
  cloudId: string;
}

export enum RecentContainerType {
  JIRA_PROJECT = 'jira-project',
  CONFLUENCE_SPACE = 'confluence-space',
}

export enum CollaborationGraphRecentContainerType {
  JIRA_PROJECT = 'jiraProject',
  CONFLUENCE_SPACE = 'confluenceSpace',
}

export interface RecentContainer {
  name: string;
  url: string;
  objectId: string;
  iconUrl: string;
  type: RecentContainerType;
}

export interface CollaborationGraphRecentContainer {
  entityType: string;
  containerType: CollaborationGraphRecentContainerType;
  id: string;
  containerDetails: ContainerDetails;
  score: number;
}

export interface ContainerDetails {
  id: string;
  key: string;
  name: string;
  url: string;
  iconUrl: string;
}

export interface CustomLink {
  key: string;
  label: string;
  link: string;
  local: boolean;
}

export enum Permissions {
  MANAGE = 'manage',
  CAN_INVITE_USERS = 'invite-users',
  ADD_PRODUCTS = 'add-products',
}

export enum Product {
  BITBUCKET = 'bitbucket',
  CONFLUENCE = 'confluence',
  HOME = 'home',
  JIRA = 'jira',
  SITE_ADMIN = 'site-admin',
  TRUSTED_ADMIN = 'trusted-admin',
  TRELLO = 'trello',
  START = 'start',
}

export enum Feature {
  disableCustomLinks = 'disableCustomLinks',
  disableRecentContainers = 'disableRecentContainers',
  disableSwitchToHeading = 'disableSwitchToHeading',
  xflow = 'xflow',
  isDiscoverMoreForEveryoneEnabled = 'isDiscoverMoreForEveryoneEnabled',
  // EMCEE stands for Embedded Marketplace with in the product
  isEmceeLinkEnabled = 'isEmceeLinkEnabled',
  // Enable Discover section - group suggested product links in Discover section
  isDiscoverSectionEnabled = 'isDiscoverSectionEnabled',
  // Enable copy change for free editions of products in the Discover section
  isDefaultEditionFreeExperimentEnabled = 'isDefaultEditionFreeExperimentEnabled',
  // Use collaboration graph endpoint to show recent containers
  isCollaborationGraphRecentContainersEnabled = 'isCollaborationGraphRecentContainersEnabled',
  // Show JSW first in product recommendations
  isProductStoreInTrelloJSWFirstEnabled = 'isProductStoreInTrelloJSWFirstEnabled',
  // Show Confluence first in product recommendations
  isProductStoreInTrelloConfluenceFirstEnabled = 'isProductStoreInTrelloConfluenceFirstEnabled',
}

export type FeatureFlagProps = {
  // Custom links are enabled by default for Jira and Confluence, this feature flag allows to hide them. Custom links are not supported by the switcher in any other products.
  disableCustomLinks?: boolean;
  // Hide recent containers. Recent containers are enabled by default.
  disableRecentContainers?: boolean;
  // Remove Switch-To section header - useful in nav v3
  disableSwitchToHeading?: boolean;
  // Enable discover more.
  isDiscoverMoreForEveryoneEnabled?: boolean;
  // Enable Embedded Marketplace within the product.
  isEmceeLinkEnabled?: boolean;
  // Enable Discover section - group suggested product links in Discover section
  isDiscoverSectionEnabled?: boolean;
  // Enable copy change for free editions of products in the Discover section
  isDefaultEditionFreeExperimentEnabled?: boolean;
  // Use collaboration graph endpoint to show recent containers
  isCollaborationGraphRecentContainersEnabled?: boolean;
};

export type FeatureMap = { [key in Feature]: boolean };

export type CustomLinksResponse = CustomLink[];

export type ProvisionedProducts = { [key in SwitcherProductType]?: boolean };

export interface CurrentSite {
  url: string;
  products: AvailableProduct[];
}

export interface UserSiteDataResponse {
  currentSite: CurrentSite;
}

export interface XFlowSettingsResponse {
  'product-suggestions-enabled'?: boolean;
}

export interface UserPermissionResponse {
  permitted: boolean;
}

export interface RecentContainersResponse {
  data: Array<RecentContainer> | null;
}

export interface CollaborationGraphContainersResponse {
  collaborationGraphEntities: Array<CollaborationGraphRecentContainer> | null;
}

export interface ProvisionedProductsResponse extends ProvisionedProducts {}

// Coincides with the product types in the Available Products Service
export enum SwitcherProductType {
  JIRA_BUSINESS = 'JIRA_BUSINESS',
  JIRA_SERVICE_DESK = 'JIRA_SERVICE_DESK',
  JIRA_SERVICE_DESK_MYSTIQUE = 'JIRA_SERVICE_DESK_MYSTIQUE',
  JIRA_SOFTWARE = 'JIRA_SOFTWARE',
  CONFLUENCE = 'CONFLUENCE',
  OPSGENIE = 'OPSGENIE',
  BITBUCKET = 'BITBUCKET',
  STATUSPAGE = 'STATUSPAGE',
  TRELLO = 'TRELLO',
  DRAGONFRUIT = 'DRAGONFRUIT',
}

export type AvailableProduct =
  | {
      productType:
        | SwitcherProductType.JIRA_BUSINESS
        | SwitcherProductType.JIRA_SERVICE_DESK
        | SwitcherProductType.JIRA_SOFTWARE
        | SwitcherProductType.CONFLUENCE
        | SwitcherProductType.DRAGONFRUIT;
    }
  | AvailableProductWithUrl;

interface AvailableProductWithUrl {
  productType:
    | SwitcherProductType.BITBUCKET
    | SwitcherProductType.OPSGENIE
    | SwitcherProductType.STATUSPAGE // assuming that the URL is provided by TCS (same as Opsgenie)
    | SwitcherProductType.TRELLO;
  url: string;
}

export interface AvailableSite {
  adminAccess: boolean;
  availableProducts: AvailableProduct[];
  avatar: string | null;
  cloudId: string;
  displayName: string;
  url: string;
}

export interface AvailableProductsResponse {
  sites: AvailableSite[];
  unstableFeatures?: {
    act959Enabled?: boolean; // [FD-15975]: Remove after the featue flag is rolled out to 100%
    mystiqueEnabled?: boolean; // [FD-15974]: Remove after the feature flag is rolled out to 100%
  };
}

export interface JoinableSiteUser {
  avatarUrl: string;
  displayName: string;
  relevance?: number;
}

export interface JoinableSiteUserAvatarPropTypes {
  name: string;
  src: string;
  appearance: 'circle';
  size: 'small';
}

export interface JoinableProductDetails {
  collaborators: JoinableSiteUser[];
  productUrl: string;
}

export interface JoinableProductsWithProductUrl {
  [key: string]: JoinableProductDetails;
}

export interface JoinableProductsWithUserIds {
  [key: string]: string[];
}

export interface JoinableSiteUsersKeyedByProduct {
  [key: string]: JoinableSiteUser[];
}

export type JoinableProducts =
  | JoinableProductsWithProductUrl
  | JoinableProductsWithUserIds;

export interface JoinableSiteWithProducts {
  products: JoinableProducts;
  users?: JoinableSiteUsersKeyedByProduct;
}

export interface JoinableSiteWithUsers {
  products?: JoinableProducts;
  users: JoinableSiteUsersKeyedByProduct;
}

export type JoinableSite = {
  cloudId: string;
  displayName: string;
  url: string;
  avatarUrl?: string;
  relevance?: number;
} & (JoinableSiteWithProducts | JoinableSiteWithUsers);

export interface JoinableSitesResponse {
  sites: JoinableSite[];
}

export enum ProductKey {
  CONFLUENCE = 'confluence.ondemand',
  JIRA_CORE = 'jira-core.ondemand',
  JIRA_SOFTWARE = 'jira-software.ondemand',
  JIRA_SERVICE_DESK = 'jira-servicedesk.ondemand',
  BITBUCKET = 'bitbucket',
  OPSGENIE = 'opsgenie',
  STATUSPAGE = 'statuspage',
  TRELLO = 'trello',
  DRAGONFRUIT = 'dragonfruit',
}

export type RecommendationsEngineResponse = RecommendationItem[];

export interface RecommendationItem {
  productKey: ProductKey;
}

export type RecommendationsFeatureFlags = {
  [key: string]: string | boolean;
};

// A map of feature flags used by the XFlow recommendations engine.
export interface WithRecommendationsFeatureFlags {
  recommendationsFeatureFlags: RecommendationsFeatureFlags;
}

export interface SwitcherChildItem {
  href: string;
  label: string;
  avatar: string | null;
}

export interface JoinableSiteClickHandlerData {
  availableProducts: SwitcherItemType[];
  event: React.SyntheticEvent;
  cloudId: string;
  href?: string;
  productType?: SwitcherProductType;
}

export interface JoinableSiteClickHandler {
  (data: JoinableSiteClickHandlerData): void;
}

export interface RenderAddOnData {
  availableProducts: SwitcherItemType[];
  joinableSiteLinks: SwitcherItemType[];
}

export interface RenderAddOn {
  (data: RenderAddOnData): ReactNode;
}

export interface ProviderResults {
  availableProducts: ProviderResult<AvailableProductsResponse>;
  joinableSites: ProviderResult<JoinableSitesResponse>;
  managePermission: ProviderResult<boolean>;
  addProductsPermission: ProviderResult<boolean>;
  isXFlowEnabled: ProviderResult<boolean>;
  productRecommendations: ProviderResult<RecommendationsEngineResponse>;
  recentContainers: ProviderResult<RecentContainersResponse>;
  collaborationGraphRecentContainers: ProviderResult<
    CollaborationGraphContainersResponse
  >;
  customLinks?: ProviderResult<CustomLinksResponse>;
}

export interface SyntheticProviderResults {
  provisionedProducts: ProviderResult<ProvisionedProductsResponse>;
  userSiteData: ProviderResult<UserSiteDataResponse>;
}

export type AtlassianSwitcherProps = WithTheme &
  Partial<WithRecommendationsFeatureFlags> & {
    // Product name used for analytics events
    product: string;
    // Optional cloudID, should be provided for tenanted applications.
    cloudId?: string;
    // Optional callback to be exectuted after an XFlow event is triggered.
    triggerXFlow?: TriggerXFlowCallback;
    // Optional callback to be exectuted after a user clicks on discover more.
    onDiscoverMoreClicked?: DiscoverMoreCallback;
    // Optional custom provider for available products
    availableProductsDataProvider?: AvailableProductsDataProvider;
    // Optional custom provider for joinable sites
    joinableSitesDataProvider?: JoinableSitesDataProvider;
    // Optional function allowing to close the switcher, e.g. after a joinable site link is clicked
    onClose?: () => void;
    // Optional parameter to indicate that the user does not have a linked Atlassian account (Trello specific)
    nonAaMastered?: boolean;
    // Optional user email (Trello specific)
    defaultSignupEmail?: string;
    // Optional admin URl (required for Statuspage)
    adminUrl?: string;
  } & FeatureFlagProps;

export enum DiscoverLinkItemKeys {
  DISCOVER_MORE = 'discover-more',
  GIT_TOOLS = 'appswitcher.git.tools',
}
