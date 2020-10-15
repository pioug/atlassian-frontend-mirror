import React from 'react';
import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import {
  createAndFireEvent,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
  CreateUIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import {
  UI_EVENT_TYPE,
  OPERATIONAL_EVENT_TYPE,
} from '@atlaskit/analytics-gas-types';
import { ProviderResults, SyntheticProviderResults } from '../../types';
import { SwitcherItemType } from './links';
import { urlToHostname } from './url-to-hostname';
import { JoinableSiteItemType } from '../../cross-join/utils/cross-join-links';

type PropsToContextMapper<P, C> = (props: P) => C;

export const NAVIGATION_CHANNEL = 'navigation';
export const SWITCHER_SUBJECT = 'atlassianSwitcher';
export const SWITCHER_ITEM_SUBJECT = 'atlassianSwitcherItem';
export const SWITCHER_CHILD_ITEM_SUBJECT = 'atlassianSwitcherChildItem';
export const SWITCHER_ITEM_EXPAND_SUBJECT = 'atlassianSwitcherItemExpand';
export const SWITCHER_COMPONENT = 'atlassianSwitcher';
export const SWITCHER_SOURCE = 'atlassianSwitcher';
export const TRIGGER_COMPONENT = 'atlassianSwitcherPrefetch';
export const TRIGGER_SUBJECT = 'atlassianSwitcherPrefetch';
export const SWITCHER_TRELLO_SIGN_UP_TO_JOIN_SUBJECT =
  'atlassianSwitcherTrelloSignUpToJoin';
export const SWITCHER_TRELLO_HAS_NEW_FRIENDS_SUBJECT =
  'atlassianSwitcherTrelloHasNewFriends';
export const SWITCHER_TRELLO_HAS_NEW_FRIENDS_DISMISS_SUBJECT =
  'atlassianSwitcherTrelloHasNewFriendsDismiss';

const SWITCHER_JOINABLE_SITES = 'atlassianSwitcherJoinableSites';
const SWITCHER_RECOMMENDED_PRODUCTS = 'atlassianSwitcherRecommendedProducts';
const SWITCHER_DISCOVER_MORE = 'atlassianSwitcherDiscoverMore';
const SWITCHER_RECENT_CONTAINERS = 'atlassianSwitcherRecentContainers';
const SWITCHER_CUSTOM_LINKS = 'atlassianSwitcherCustomLinks';

const RENDERED_ACTION = 'rendered';
const NOT_RENDERED_ACTION = 'not_rendered';
const VIEWED_ACTION = 'viewed';

export const createAndFireNavigationEvent = createAndFireEvent(
  NAVIGATION_CHANNEL,
);

export const analyticsAttributes = <T extends object>(attributes: T) => ({
  attributes,
});

export const withAnalyticsContextData = function <P, C>(
  mapPropsToContext: PropsToContextMapper<P, C>,
) {
  return function (
    WrappedComponent: React.ComponentType<P>,
  ): React.ComponentType<P> {
    return props => (
      <NavigationAnalyticsContext data={mapPropsToContext(props)}>
        <WrappedComponent {...props} />
      </NavigationAnalyticsContext>
    );
  };
};

interface RenderTrackerProps extends WithAnalyticsEventsProps {
  subject: string;
  data?: object;
  onRender?: any;
}

export const RenderTracker = withAnalyticsEvents({
  onRender: (
    createAnalyticsEvent: CreateUIAnalyticsEvent,
    props: RenderTrackerProps,
  ) => {
    return createAnalyticsEvent({
      eventType: OPERATIONAL_EVENT_TYPE,
      action: RENDERED_ACTION,
      actionSubject: props.subject,
      attributes: props.data,
    }).fire(NAVIGATION_CHANNEL);
  },
})(
  class extends React.Component<RenderTrackerProps> {
    componentDidMount() {
      this.props.onRender();
    }

    render() {
      return null;
    }
  },
);

export const NotRenderedTracker = withAnalyticsEvents({
  onRender: (
    createAnalyticsEvent: CreateUIAnalyticsEvent,
    props: RenderTrackerProps,
  ) => {
    return createAnalyticsEvent({
      eventType: OPERATIONAL_EVENT_TYPE,
      action: NOT_RENDERED_ACTION,
      actionSubject: props.subject,
      attributes: props.data,
    }).fire(NAVIGATION_CHANNEL);
  },
})(
  class extends React.Component<RenderTrackerProps> {
    componentDidMount() {
      this.props.onRender();
    }

    render() {
      return null;
    }
  },
);

export const ViewedTracker = withAnalyticsEvents({
  onRender: (
    createAnalyticsEvent: CreateUIAnalyticsEvent,
    props: RenderTrackerProps,
  ) => {
    return createAnalyticsEvent({
      eventType: UI_EVENT_TYPE,
      action: VIEWED_ACTION,
      actionSubject: props.subject,
      attributes: props.data,
    }).fire(NAVIGATION_CHANNEL);
  },
})(
  class extends React.Component<RenderTrackerProps> {
    componentDidMount() {
      this.props.onRender();
    }

    render() {
      return null;
    }
  },
);

const renderTracker = ({
  subject,
  providerFailed,
  emptyRenderExpected,
  linksRendered,
  data,
}: {
  subject: string;
  providerFailed: boolean;
  emptyRenderExpected: boolean;
  linksRendered: SwitcherItemType[];
  data?: object;
}) => {
  if (providerFailed || (linksRendered.length === 0 && !emptyRenderExpected)) {
    return (
      <NotRenderedTracker
        subject={subject}
        data={{
          ...data,
          providerFailed,
        }}
      />
    );
  }

  return (
    <RenderTracker
      subject={subject}
      data={{
        ...data,
        emptyRender: emptyRenderExpected,
      }}
    />
  );
};

export const getJoinableSitesRenderTracker = (
  providerResult: ProviderResults['joinableSites'],
  joinableSiteLinks: JoinableSiteItemType[],
  data?: object,
) => {
  // The render is considered failed when either the provider failed, or the provider returned a non-empty result but nothing was rendered
  const emptyRenderExpected = Boolean(
    providerResult.data && providerResult.data.sites.length === 0,
  );

  return renderTracker({
    subject: SWITCHER_JOINABLE_SITES,
    providerFailed: providerResult.data === null,
    emptyRenderExpected,
    linksRendered: joinableSiteLinks,
    data,
  });
};

export const getRecommendedProductsRenderTracker = (
  xflowProviderResult: ProviderResults['isXFlowEnabled'],
  provisionedProductsProviderResult: SyntheticProviderResults['provisionedProducts'],
  suggestedProductLinks: SwitcherItemType[],
  data?: object,
) => {
  // The render is only considered failed when one of the providers failed, and empty render is a valid case
  const providerFailed =
    xflowProviderResult.data === null ||
    provisionedProductsProviderResult.data === null;
  const emptyRenderExpected = suggestedProductLinks.length === 0;
  return renderTracker({
    subject: SWITCHER_RECOMMENDED_PRODUCTS,
    providerFailed,
    emptyRenderExpected,
    linksRendered: suggestedProductLinks,
    data,
  });
};

export const getDiscoverMoreRenderTracker = (
  isDiscoverMoreForEveryoneEnabled: Boolean,
  addProductsPermissionProviderResult: ProviderResults['addProductsPermission'],
  managePermissionProviderResult: ProviderResults['managePermission'],
  discoverMoreLink: SwitcherItemType[],
  data?: object,
) => {
  const providerFailed =
    addProductsPermissionProviderResult.data === null ||
    managePermissionProviderResult.data === null;
  const shouldShowDiscoverMore =
    addProductsPermissionProviderResult.data ||
    managePermissionProviderResult.data ||
    isDiscoverMoreForEveryoneEnabled;

  return renderTracker({
    subject: SWITCHER_DISCOVER_MORE,
    providerFailed,
    emptyRenderExpected: !shouldShowDiscoverMore,
    linksRendered: discoverMoreLink,
    data,
  });
};

export const getRecentContainersRenderTracker = (
  isCollaborationGraphRecentEnabled: Boolean,
  recentContainersProviderResult: ProviderResults['recentContainers'],
  cgRecentContainersProviderResult: ProviderResults['collaborationGraphRecentContainers'],
  userSiteDataProviderResult: SyntheticProviderResults['userSiteData'],
  recentLinks: SwitcherItemType[],
  data?: object,
) => {
  const providerFailed =
    (isCollaborationGraphRecentEnabled
      ? cgRecentContainersProviderResult.data === null
      : recentContainersProviderResult.data === null) ||
    userSiteDataProviderResult.data === null;
  const emptyRenderExpected = Boolean(
    isCollaborationGraphRecentEnabled
      ? cgRecentContainersProviderResult.data &&
          cgRecentContainersProviderResult.data.collaborationGraphEntities &&
          cgRecentContainersProviderResult.data.collaborationGraphEntities
            .length === 0
      : recentContainersProviderResult.data &&
          recentContainersProviderResult.data.data &&
          recentContainersProviderResult.data.data.length === 0,
  );

  return renderTracker({
    subject: SWITCHER_RECENT_CONTAINERS,
    providerFailed,
    emptyRenderExpected,
    linksRendered: recentLinks,
    data,
  });
};

export const getCustomLinksRenderTracker = (
  customLinksProviderResult: ProviderResults['customLinks'] | undefined,
  userSiteDataProviderResult: SyntheticProviderResults['userSiteData'],
  customLinks: SwitcherItemType[],
  data?: object,
) => {
  // The render is only considered failed when one of the providers failed, and empty render is a valid case
  if (!customLinksProviderResult) {
    return;
  }

  const providerFailed =
    customLinksProviderResult.data === null ||
    userSiteDataProviderResult.data === null;
  const emptyRenderExpected = customLinks.length === 0;

  return renderTracker({
    subject: SWITCHER_CUSTOM_LINKS,
    providerFailed,
    emptyRenderExpected,
    linksRendered: customLinks,
    data,
  });
};

export const getItemAnalyticsContext = (
  groupIndex: number,
  id: string | null,
  type: string,
  href: string,
  productType?: string,
  extraAttributes?: { [key: string]: string },
) => ({
  ...analyticsAttributes({
    groupIndex,
    itemId: id,
    itemType: type,
    domain: urlToHostname(href),
    productType,
    ...extraAttributes,
  }),
});

export {
  withAnalyticsEvents,
  NavigationAnalyticsContext,
  OPERATIONAL_EVENT_TYPE,
  UI_EVENT_TYPE,
};
export type { WithAnalyticsEventsProps };
