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
  enableRecentContainers = 'enableRecentContainers',
  disableSwitchToHeading = 'disableSwitchToHeading',
  xflow = 'xflow',
  // EMCEE stands for Embedded Marketplace with in the product
  isEmceeLinkEnabled = 'isEmceeLinkEnabled',
  // Show JSW first in product recommendations
  isProductStoreInTrelloJSWFirstEnabled = 'isProductStoreInTrelloJSWFirstEnabled',
  // Show Confluence first in product recommendations
  isProductStoreInTrelloConfluenceFirstEnabled = 'isProductStoreInTrelloConfluenceFirstEnabled',
  // Integrations discovery button and copy changes to More products
  isSlackDiscoveryEnabled = 'isSlackDiscoveryEnabled',
}

export type FeatureFlagProps = {
  /** Custom links are enabled by default for Jira and Confluence, this feature flag allows to hide them. Custom links are not supported by the switcher in any other products. */
  disableCustomLinks?: boolean;
  /** Display recent containers. Recent containers are disabled by default. **/
  enableRecentContainers?: boolean;
  /** Remove Switch-To section header - useful in nav v3  */
  disableSwitchToHeading?: boolean;
  /** Enable Embedded Marketplace within the product.  */
  isEmceeLinkEnabled?: boolean;
  /** Enable Integrations discovery in the discover more section  */
  isSlackDiscoveryEnabled?: boolean;
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

export interface CollaborationGraphContainersResponse {
  collaborationGraphEntities: Array<CollaborationGraphRecentContainer> | null;
}

export interface ProvisionedProductsResponse extends ProvisionedProducts {}

// Coincides with the product types in the Available Products Service
export enum SwitcherProductType {
  JIRA_BUSINESS = 'JIRA_BUSINESS',
  JIRA_WORK_MANAGEMENT = 'JIRA_WORK_MANAGEMENT',
  JIRA_SERVICE_DESK = 'JIRA_SERVICE_DESK',
  JIRA_SOFTWARE = 'JIRA_SOFTWARE',
  CONFLUENCE = 'CONFLUENCE',
  OPSGENIE = 'OPSGENIE',
  BITBUCKET = 'BITBUCKET',
  STATUSPAGE = 'STATUSPAGE',
  TRELLO = 'TRELLO',
  DRAGONFRUIT = 'DRAGONFRUIT',
  TEAM_CENTRAL = 'TEAM_CENTRAL',
  AVOCADO = 'AVOCADO',
}

export enum AnalyticsItemType {
  PRODUCT = 'product',
  ADMIN = 'admin',
  TRY = 'try',
  JOIN = 'join',
  CUSTOM_LINK = 'customLink',
  DISCOVER_FIXED_LINKS = 'discover-fixed-links',
  RECENT = 'recent',
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
    | SwitcherProductType.TRELLO
    | SwitcherProductType.TEAM_CENTRAL
    | SwitcherProductType.AVOCADO;
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
  isPartial: boolean;
  unstableFeatures?: {
    act959Enabled?: boolean; // [FD-15975]: Remove after the featue flag is rolled out to 100%
    jwmRebrandEnabled?: boolean; // [FD-20847]: Remove after feature flag rolled out to 100%
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
  TEAM_CENTRAL = 'townsquare',
  AVOCADO = 'avocado',
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
    // Optional ability to highlight a joinable site
    highlightedJoinableItemHref?: string;
    // Optional function allowing to close the switcher, e.g. after a joinable site link is clicked
    onClose?: () => void;
    // Optional parameter to indicate that the user does not have a linked Atlassian account (Trello specific)
    nonAaMastered?: boolean;
    // Optional user email (Trello specific)
    defaultSignupEmail?: string;
    // Optional admin URl (required for Statuspage)
    adminUrl?: string;
    // Optional callback to be executed for adding Origin Tracing info onto switcher links.
    customizeLinks?: CustomizeLinks;
  } & FeatureFlagProps;

export enum DiscoverLinkItemKeys {
  DISCOVER_MORE = 'discover-more',
  GIT_TOOLS = 'appswitcher.git.tools',
  SLACK_INTEGRATION = 'slack-integration',
}

export interface AnalyticAttributes {
  [key: string]: any;
}

export interface MapUrl {
  (url: string, product: SwitcherProductType): string;
}
export interface GetExtendedAnalyticsAttributes {
  (product?: SwitcherProductType): AnalyticAttributes;
}

export interface CustomizeLinks {
  (): {
    // Provide function to update switcher url
    mapUrl: MapUrl;
    // Provides function to return additonal AnalyticAttributes
    getExtendedAnalyticsAttributes: GetExtendedAnalyticsAttributes;
  };
}

//
export interface ProductRecommendationsResponse {
  capability: ProductRecommendationsCapabilityProperty;
}

export type ProductRecommendationsCapabilityProperty = {
  REQUEST_ACCESS: Array<ProductRecommendationResource>;
  DIRECT_ACCESS: Array<ProductRecommendationResource>;
};

export type ProductRecommendationResource = {
  resourceId: string; //"ari:cloud:statuspage::site/bd98310f-491e-4af3-89a1-a23c6a9db606",
  userAccessLevel: string; //"INTERNAL",
  roleAri: string; //"ari:cloud:statuspage::role/product/member",
  url: string; //"https://manage.statuspagestaging.com/cloud/bd98310f-491e-4af3-89a1-a23c6a9db606",
  displayName: string; //"recommendations1",
  avatarUrl: string; //"https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/lightbulb.png"
};
