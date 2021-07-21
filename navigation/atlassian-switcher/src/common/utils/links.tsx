import React from 'react';
import { FormattedMessage as FormattedMessageNamespace } from 'react-intl';
import {
  AtlassianIcon,
  BitbucketIcon,
  ConfluenceIcon,
  JiraSoftwareIcon,
  JiraServiceManagementIcon,
  JiraWorkManagementIcon,
  OpsgenieIcon,
  StatuspageIcon,
  TrelloIcon,
  CompassIcon,
} from '@atlaskit/logo';
import WorldIcon from '@atlaskit/icon/glyph/world';

import FormattedMessage from '../../ui/primitives/formatted-message';
import {
  AvailableProductsResponse,
  AvailableProduct,
  SwitcherProductType,
  ProductKey,
  ProvisionedProducts,
  CurrentSite,
  CollaborationGraphRecentContainer,
  CollaborationGraphRecentContainerType,
  MapUrl,
} from '../../types';
import messages from './messages';
import { CustomLink, SwitcherChildItem } from '../../types';
import { createIcon, createImageIcon, IconType } from './icon-themes';
import { getProductDataWithJwmRebrandFF } from './map-to-switcher-props-with-jwm-rebrand-ff';

interface MessagesDict {
  [index: string]: FormattedMessageNamespace.MessageDescriptor;
}

export type SwitcherItemType = {
  key: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  Icon: IconType;
  href: string;
  childItems?: SwitcherChildItem[];
  productType?: SwitcherProductType;
  analyticsAttributes?: { [key: string]: string };
};

export type RecentItemType = SwitcherItemType & {
  type: string;
  description: React.ReactNode;
};

export const OBJECT_TYPE_TO_LABEL_MAP: MessagesDict = {
  // pf-activity specific object types. To be removed when pf-activity is deprecated
  'jira-project': messages.jiraProject,
  'confluence-space': messages.confluenceSpace,
  jiraProject: messages.jiraProject,
  confluenceSpace: messages.confluenceSpace,
};

export const getObjectTypeLabel = (type: string): React.ReactNode => {
  return OBJECT_TYPE_TO_LABEL_MAP[type] ? (
    <FormattedMessage {...OBJECT_TYPE_TO_LABEL_MAP[type]} />
  ) : (
    type
  );
};

export type AvailableProductDetails = Pick<
  SwitcherItemType,
  'label' | 'Icon' | 'href' | 'description'
>;

export const AVAILABLE_PRODUCT_DATA_MAP: {
  [productKey in SwitcherProductType]: AvailableProductDetails;
} = {
  [SwitcherProductType.BITBUCKET]: {
    label: 'Bitbucket',
    Icon: createIcon(BitbucketIcon, { size: 'small' }),
    href: '/dashboard/overview',
  },
  [SwitcherProductType.CONFLUENCE]: {
    label: 'Confluence',
    Icon: createIcon(ConfluenceIcon, { size: 'small' }),
    href: '/wiki',
    description: (
      <FormattedMessage {...messages.productDescriptionConfluence} />
    ),
  },
  [SwitcherProductType.JIRA_BUSINESS]: {
    label: 'Jira Core',
    Icon: createIcon(JiraWorkManagementIcon, { size: 'small' }),
    href: '/secure/BrowseProjects.jspa?selectedProjectType=business',
  },
  [SwitcherProductType.JIRA_WORK_MANAGEMENT]: {
    label: 'Jira Work Management',
    Icon: createIcon(JiraWorkManagementIcon, { size: 'small' }),
    href: '/secure/BrowseProjects.jspa?selectedProjectType=business',
  },
  [SwitcherProductType.JIRA_SOFTWARE]: {
    label: 'Jira Software',
    Icon: createIcon(JiraSoftwareIcon, { size: 'small' }),
    href: '/secure/BrowseProjects.jspa?selectedProjectType=software',
    description: (
      <FormattedMessage {...messages.productDescriptionJiraSoftware} />
    ),
  },
  [SwitcherProductType.JIRA_SERVICE_DESK]: {
    label: 'Jira Service Management',
    Icon: createIcon(JiraServiceManagementIcon, { size: 'small' }),
    href: '/secure/BrowseProjects.jspa?selectedProjectType=service_desk',
    description: (
      <FormattedMessage {...messages.productDescriptionJiraServiceManagement} />
    ),
  },
  [SwitcherProductType.COMPASS]: {
    label: 'Compass',
    Icon: createIcon(CompassIcon, { size: 'small' }),
    href: '/compass',
    description: <FormattedMessage {...messages.productDescriptionCompass} />,
  },
  [SwitcherProductType.TEAM_CENTRAL]: {
    label: 'Team Central (Beta)',
    Icon: createIcon(AtlassianIcon, { size: 'small' }),
    href: 'https://team.atlassian.com',
  },
  [SwitcherProductType.AVOCADO]: {
    label: 'Avocado',
    Icon: createIcon(AtlassianIcon, { size: 'small' }),
    href: '',
  },
  [SwitcherProductType.OPSGENIE]: {
    label: 'Opsgenie',
    Icon: createIcon(OpsgenieIcon, { size: 'small' }),
    href: 'https://app.opsgenie.com',
    description: <FormattedMessage {...messages.productDescriptionOpsgenie} />,
  },
  [SwitcherProductType.STATUSPAGE]: {
    label: 'Statuspage',
    Icon: createIcon(StatuspageIcon, { size: 'small' }),
    href: 'https://statuspage.io',
  },
  [SwitcherProductType.TRELLO]: {
    label: 'Trello',
    Icon: createIcon(TrelloIcon, { size: 'small' }),
    href: 'https://trello.com',
  },
};

const PRODUCT_ORDER = [
  SwitcherProductType.JIRA_SOFTWARE,
  SwitcherProductType.JIRA_SERVICE_DESK,
  SwitcherProductType.JIRA_BUSINESS,
  SwitcherProductType.CONFLUENCE,
  SwitcherProductType.COMPASS,
  SwitcherProductType.OPSGENIE,
  SwitcherProductType.BITBUCKET,
  SwitcherProductType.STATUSPAGE,
  SwitcherProductType.TRELLO,
  SwitcherProductType.TEAM_CENTRAL,
  SwitcherProductType.AVOCADO,
];

export const TO_SWITCHER_PRODUCT_KEY: {
  [Key in ProductKey]: SwitcherProductType;
} = {
  [ProductKey.CONFLUENCE]: SwitcherProductType.CONFLUENCE,
  [ProductKey.JIRA_CORE]: SwitcherProductType.JIRA_BUSINESS,
  [ProductKey.JIRA_SERVICE_DESK]: SwitcherProductType.JIRA_SERVICE_DESK,
  [ProductKey.JIRA_SOFTWARE]: SwitcherProductType.JIRA_SOFTWARE,
  [ProductKey.OPSGENIE]: SwitcherProductType.OPSGENIE,
  [ProductKey.BITBUCKET]: SwitcherProductType.BITBUCKET,
  [ProductKey.STATUSPAGE]: SwitcherProductType.STATUSPAGE,
  [ProductKey.TRELLO]: SwitcherProductType.TRELLO,
  [ProductKey.COMPASS]: SwitcherProductType.COMPASS,
  [ProductKey.TEAM_CENTRAL]: SwitcherProductType.TEAM_CENTRAL,
  [ProductKey.AVOCADO]: SwitcherProductType.AVOCADO,
};

export interface ConnectedSite {
  avatar: string | null;
  product: AvailableProduct;
  isCurrentSite: boolean;
  siteName: string;
  siteUrl: string;
}

export const getProductSiteUrl = (connectedSite: ConnectedSite): string => {
  const { product, siteUrl } = connectedSite;

  if (
    product.productType === SwitcherProductType.OPSGENIE ||
    product.productType === SwitcherProductType.STATUSPAGE ||
    product.productType === SwitcherProductType.TRELLO ||
    product.productType === SwitcherProductType.TEAM_CENTRAL ||
    product.productType === SwitcherProductType.AVOCADO
  ) {
    return product.url;
  }

  return siteUrl + AVAILABLE_PRODUCT_DATA_MAP[product.productType].href;
};

const getAvailableProductLinkFromSiteProduct = (
  connectedSites: ConnectedSite[],
  mapUrl: MapUrl,
  jwmRebrandEnabled: boolean,
): SwitcherItemType => {
  const topSite =
    connectedSites.find((site) => site.isCurrentSite) ||
    connectedSites.sort((a, b) => a.siteName.localeCompare(b.siteName))[0];
  const productType = topSite.product.productType;
  const productLinkProperties = jwmRebrandEnabled
    ? getProductDataWithJwmRebrandFF(productType, jwmRebrandEnabled)
    : AVAILABLE_PRODUCT_DATA_MAP[productType];

  return {
    ...productLinkProperties,
    key: productType + topSite.siteName,
    href: mapUrl(getProductSiteUrl(topSite), productType),
    description: topSite.siteName,
    productType,
    childItems:
      connectedSites.length > 1
        ? connectedSites
            .map((site) => ({
              href: mapUrl(getProductSiteUrl(site), productType),
              label: site.siteName,
              avatar: site.avatar,
            }))
            .sort((a, b) => a.label.localeCompare(b.label))
        : [],
  };
};

export const getAvailableProductLinks = (
  availableProducts: AvailableProductsResponse,
  cloudId: string | null | undefined,
  mapUrl: MapUrl,
  features: {
    jwmRebrandEnabled: boolean;
  },
): SwitcherItemType[] => {
  const productsMap: { [key: string]: ConnectedSite[] } = {};
  availableProducts.sites.forEach((site) => {
    const { availableProducts, avatar, displayName, url } = site;
    availableProducts.forEach((product) => {
      const { productType } = product;

      if (!productsMap[productType]) {
        productsMap[productType] = [];
      }

      productsMap[productType].push({
        product,
        isCurrentSite: Boolean(cloudId) && site.cloudId === cloudId,
        siteName: displayName,
        siteUrl: url,
        avatar,
      });
    });
  });

  return PRODUCT_ORDER.map((productType) => {
    const connectedSites = productsMap[productType];
    return (
      connectedSites &&
      getAvailableProductLinkFromSiteProduct(
        connectedSites,
        mapUrl,
        features.jwmRebrandEnabled,
      )
    );
  }).filter((link) => !!link);
};

export const getProvisionedProducts = (
  availableProducts: AvailableProductsResponse,
): ProvisionedProducts => {
  const provisionedProducts = {} as ProvisionedProducts;
  availableProducts.sites.forEach((site) =>
    site.availableProducts.forEach(
      (product) => (provisionedProducts[product.productType] = true),
    ),
  );
  return provisionedProducts;
};

export const getCustomLinkItems = (
  list: Array<CustomLink>,
  currentSite: CurrentSite,
): SwitcherItemType[] => {
  const defaultProductCustomLinks = [
    `${currentSite.url}/secure/MyJiraHome.jspa`,
    `${currentSite.url}/wiki/`,
  ];
  return list
    .filter(
      (customLink) => defaultProductCustomLinks.indexOf(customLink.link) === -1,
    )
    .map((customLink) => ({
      key: customLink.key,
      label: customLink.label,
      Icon: createIcon(WorldIcon),
      href: customLink.link,
      analyticsAttributes: {
        linkType: customLink.local ? 'customLink' : 'applink',
      },
    }));
};

export const getRecentLinkItemsCollaborationGraph = (
  list: Array<CollaborationGraphRecentContainer>,
  currentSite: CurrentSite,
): RecentItemType[] => {
  const isAnyJiraProductActive = Boolean(
    currentSite.products.find(
      (product) =>
        product.productType === SwitcherProductType.JIRA_BUSINESS ||
        product.productType === SwitcherProductType.JIRA_SERVICE_DESK ||
        product.productType === SwitcherProductType.JIRA_SOFTWARE,
    ),
  );
  const isConfluenceActive = Boolean(
    currentSite.products.find(
      (product) => product.productType === SwitcherProductType.CONFLUENCE,
    ),
  );

  return list
    .filter((recent: CollaborationGraphRecentContainer) => {
      return (
        (recent.containerType ===
          CollaborationGraphRecentContainerType.JIRA_PROJECT &&
          isAnyJiraProductActive) ||
        (recent.containerType ===
          CollaborationGraphRecentContainerType.CONFLUENCE_SPACE &&
          isConfluenceActive) ||
        [
          CollaborationGraphRecentContainerType.JIRA_PROJECT.toString(),
          CollaborationGraphRecentContainerType.CONFLUENCE_SPACE.toString(),
        ].indexOf(recent.containerType) === -1
      );
    })
    .slice(0, 6)
    .map((recentLink) => ({
      key: recentLink.id,
      label: recentLink.containerDetails.name,
      Icon: createImageIcon(recentLink.containerDetails.iconUrl),
      href: recentLink.containerDetails.url,
      type: recentLink.containerType,
      description: getObjectTypeLabel(recentLink.containerType),
    }));
};
