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
import {
  ProviderResults,
  SyntheticProviderResults,
  UserSiteDataResponse,
  AnalyticsItemType,
  SwitcherProductType,
} from '../../../types';
import { SwitcherItemType } from '../links';
import { getRenderBucket } from '../render-tracker-bucketing';
import { JoinableSiteItemType } from '../../../cross-join/utils/cross-join-links';
import {
  ProviderResult,
  ResultError,
  Status,
} from '../../providers/as-data-provider';
import { CLLoggableErrorReason } from './types';
import { UserSiteDataError } from '../errors/user-site-data-error';
type PropsToContextMapper<P, C> = (props: P) => C;

type PIIFreeString = string;

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
    return (props) => (
      <NavigationAnalyticsContext data={mapPropsToContext(props)}>
        <WrappedComponent {...props} />
      </NavigationAnalyticsContext>
    );
  };
};

const isValidDuration = (duration: number | undefined): duration is number => {
  return duration !== null && duration !== undefined && duration >= 0;
};

interface RenderTrackerProps extends WithAnalyticsEventsProps {
  subject: string;
  data?: {
    [otherOptions: string]: unknown;
    duration?: number;
  };
  onRender?: any;
}

export const RenderTracker = withAnalyticsEvents({
  onRender: (
    createAnalyticsEvent: CreateUIAnalyticsEvent,
    props: RenderTrackerProps,
  ) => {
    const duration = props.data?.duration;
    return createAnalyticsEvent({
      eventType: OPERATIONAL_EVENT_TYPE,
      action: RENDERED_ACTION,
      actionSubject: props.subject,
      attributes: {
        ...props.data,
        ...(isValidDuration(duration) && {
          bucket: getRenderBucket(duration),
        }),
      },
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

const renderTrackerWithReason = <T,>({
  subject,
  notRenderedReason,
  emptyRenderExpected,
  data,
}: {
  subject: string;
  notRenderedReason: T | null;
  emptyRenderExpected: boolean;
  data?: object;
}) => {
  if (notRenderedReason) {
    return (
      <NotRenderedTracker
        subject={subject}
        data={{
          ...data,
          notRenderedReason,
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
  isDiscoverMoreClickable: boolean,
  data?: object,
) => {
  if (!isDiscoverMoreClickable) {
    return null;
  }
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
  addProductsPermissionProviderResult: ProviderResults['addProductsPermission'],
  managePermissionProviderResult: ProviderResults['managePermission'],
  discoverMoreLink: SwitcherItemType[],
  isDiscoverMoreClickable: boolean,
  data?: object,
) => {
  if (!isDiscoverMoreClickable) {
    return null;
  }
  const providerFailed =
    addProductsPermissionProviderResult.data === null ||
    managePermissionProviderResult.data === null;

  return renderTracker({
    subject: SWITCHER_DISCOVER_MORE,
    providerFailed,
    emptyRenderExpected: false,
    linksRendered: discoverMoreLink,
    data: {
      ...data,
      linkItems: discoverMoreLink.map((item) => item.key),
    },
  });
};

export const getRecentContainersRenderTracker = (
  isEnabled: Boolean,
  cgRecentContainersProviderResult: ProviderResults['collaborationGraphRecentContainers'],
  userSiteDataProviderResult: SyntheticProviderResults['userSiteData'],
  recentLinks: SwitcherItemType[],
  data?: object,
) => {
  if (!isEnabled) {
    return null;
  }

  const providerFailed =
    cgRecentContainersProviderResult.data === null ||
    userSiteDataProviderResult.data === null;
  const emptyRenderExpected = Boolean(
    cgRecentContainersProviderResult.data &&
      cgRecentContainersProviderResult.data.collaborationGraphEntities &&
      cgRecentContainersProviderResult.data.collaborationGraphEntities
        .length === 0,
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
  userSiteDataProviderResult: ProviderResult<UserSiteDataResponse>,
  customLinks: SwitcherItemType[],
  data?: object,
) => {
  // The render is only considered failed when one of the providers failed, and empty render is a valid case
  if (!customLinksProviderResult) {
    return;
  }

  const emptyRenderExpected = customLinks.length === 0;

  function getNotRenderedReason(): CLLoggableErrorReason | null {
    if (customLinksProviderResult?.status === Status.ERROR) {
      return 'custom_links_api_error';
    }
    const error = (userSiteDataProviderResult as ResultError).error;
    if (!error) {
      return null;
    }
    if (error instanceof UserSiteDataError) {
      return error.reason;
    } else {
      return 'usd_unknown';
    }
  }

  const notRenderedReason = getNotRenderedReason();
  return renderTrackerWithReason<CLLoggableErrorReason>({
    subject: SWITCHER_CUSTOM_LINKS,
    notRenderedReason,
    emptyRenderExpected,
    data,
  });
};

/**
 *
 * ***IMPORTANT*** DO NOT send PD / PII or any sensitive data.
 * This function defines analytic event attributes.
 *
 * @param groupIndex
 * @param id
 * @param type
 * @param productType
 * @param extraAttributes
 */
export const getItemAnalyticsContext = (
  groupIndex: number,
  id: PIIFreeString | null,
  type: AnalyticsItemType,
  productType?: SwitcherProductType,
  extraAttributes?: { [key: string]: string },
) => ({
  ...analyticsAttributes({
    groupIndex,
    itemId: id,
    itemType: type,
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
