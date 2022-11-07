import React from 'react';
import {
  createPortal,
  unstable_renderSubtreeIntoContainer,
  unmountComponentAtNode,
} from 'react-dom';
import PropTypes from 'prop-types';
import { default as AnalyticsReactContext } from '@atlaskit/analytics-next-stable-react-context';
import { EventDispatcher } from '../../event-dispatcher';
import { FireAnalyticsCallback } from '../../plugins/analytics/fire-analytics-event';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '../../plugins/analytics/types/enums';
import {
  useIntl,
  IntlShape,
  RawIntlProvider,
  WrappedComponentProps,
  injectIntl,
} from 'react-intl-next';
import { useGlobalTheme } from '@atlaskit/theme/components';
import type { ThemeModes } from '@atlaskit/theme/types';

import { PortalProviderThemeProviders } from './PortalProviderThemesProvider';
import { IntlProviderIfMissingWrapper } from '@atlaskit/editor-common/ui';

export type BasePortalProviderProps = {
  render: (
    portalProviderAPI: PortalProviderAPI,
  ) => React.ReactChild | JSX.Element | null;
  onAnalyticsEvent?: FireAnalyticsCallback;
  useAnalyticsContext?: boolean;
  themeMode?: ThemeModes;
} & WrappedComponentProps;

export type Portals = Map<HTMLElement, React.ReactChild>;

export type PortalRendererState = {
  portals: Portals;
};

type MountedPortal = {
  children: () => React.ReactChild | null;
  hasAnalyticsContext: boolean;
  hasIntlContext: boolean;
};

export class PortalProviderAPI extends EventDispatcher {
  portals: Map<HTMLElement, MountedPortal> = new Map();
  context: any;
  intl: IntlShape;
  onAnalyticsEvent?: FireAnalyticsCallback;
  useAnalyticsContext?: boolean;
  themeMode?: ThemeModes;

  constructor(
    intl: IntlShape,
    onAnalyticsEvent?: FireAnalyticsCallback,
    analyticsContext?: boolean,
    themeMode?: ThemeModes,
  ) {
    super();
    this.intl = intl;
    this.onAnalyticsEvent = onAnalyticsEvent;
    this.useAnalyticsContext = analyticsContext;
    this.themeMode = themeMode;
  }

  setContext = (context: any) => {
    this.context = context;
  };

  render(
    children: () => React.ReactChild | JSX.Element | null,
    container: HTMLElement,
    hasAnalyticsContext: boolean = false,
    hasIntlContext: boolean = false,
  ) {
    this.portals.set(container, {
      children: children,
      hasAnalyticsContext,
      hasIntlContext,
    });
    const childrenWithThemeProviders = (
      <PortalProviderThemeProviders mode={this.themeMode!}>
        {children()}
      </PortalProviderThemeProviders>
    );
    let wrappedChildren = this.useAnalyticsContext ? (
      <AnalyticsContextWrapper>
        {childrenWithThemeProviders}
      </AnalyticsContextWrapper>
    ) : (
      (childrenWithThemeProviders as JSX.Element)
    );
    if (hasIntlContext) {
      wrappedChildren = (
        <RawIntlProvider value={this.intl}>{wrappedChildren}</RawIntlProvider>
      );
    }
    unstable_renderSubtreeIntoContainer(
      this.context,
      wrappedChildren,
      container,
    );
  }

  // TODO: until https://product-fabric.atlassian.net/browse/ED-5013
  // we (unfortunately) need to re-render to pass down any updated context.
  // selectively do this for nodeviews that opt-in via `hasAnalyticsContext`
  forceUpdate({
    intl,
    themeMode,
  }: {
    intl: IntlShape;
    themeMode: ThemeModes | undefined;
  }) {
    this.intl = intl;
    this.themeMode = themeMode;

    this.portals.forEach((portal, container) => {
      if (
        !portal.hasAnalyticsContext &&
        !this.useAnalyticsContext &&
        !portal.hasIntlContext
      ) {
        return;
      }

      let wrappedChildren = portal.children() as JSX.Element;

      const childrenWithThemeProviders = (
        <PortalProviderThemeProviders mode={themeMode!}>
          {wrappedChildren}
        </PortalProviderThemeProviders>
      );

      if (portal.hasAnalyticsContext && this.useAnalyticsContext) {
        wrappedChildren = (
          <AnalyticsContextWrapper>
            {childrenWithThemeProviders}
          </AnalyticsContextWrapper>
        );
      }

      if (portal.hasIntlContext) {
        wrappedChildren = (
          <RawIntlProvider value={this.intl}>
            {childrenWithThemeProviders}
          </RawIntlProvider>
        );
      }

      unstable_renderSubtreeIntoContainer(
        this.context,
        wrappedChildren,
        container,
      );
    });
  }

  remove(container: HTMLElement) {
    this.portals.delete(container);

    // There is a race condition that can happen caused by Prosemirror vs React,
    // where Prosemirror removes the container from the DOM before React gets
    // around to removing the child from the container
    // This will throw a NotFoundError: The node to be removed is not a child of this node
    // Both Prosemirror and React remove the elements asynchronously, and in edge
    // cases Prosemirror beats React
    try {
      unmountComponentAtNode(container);
    } catch (error) {
      if (this.onAnalyticsEvent) {
        this.onAnalyticsEvent({
          payload: {
            action: ACTION.FAILED_TO_UNMOUNT,
            actionSubject: ACTION_SUBJECT.EDITOR,
            actionSubjectId: ACTION_SUBJECT_ID.REACT_NODE_VIEW,
            attributes: {
              error: error as Error,
              domNodes: {
                container: container ? container.className : undefined,
                child: container.firstElementChild
                  ? container.firstElementChild.className
                  : undefined,
              },
            },
            eventType: EVENT_TYPE.OPERATIONAL,
          },
        });
      }
    }
  }
}

class BasePortalProvider extends React.Component<BasePortalProviderProps> {
  static displayName = 'PortalProvider';

  portalProviderAPI: PortalProviderAPI;

  constructor(props: BasePortalProviderProps) {
    super(props);
    this.portalProviderAPI = new PortalProviderAPI(
      props.intl,
      props.onAnalyticsEvent,
      props.useAnalyticsContext,
      props.themeMode,
    );
  }

  render() {
    return this.props.render(this.portalProviderAPI);
  }

  componentDidUpdate() {
    this.portalProviderAPI.forceUpdate({
      intl: this.props.intl,
      themeMode: this.props.themeMode,
    });
  }
}

export const PortalProvider = injectIntl(BasePortalProvider);

type PortalProviderWithThemeProvidersProps = Omit<
  BasePortalProviderProps,
  'intl' | 'themeMode'
>;

export const PortalProviderWithThemeProviders = ({
  onAnalyticsEvent,
  useAnalyticsContext,
  render,
}: PortalProviderWithThemeProvidersProps) => (
  <IntlProviderIfMissingWrapper>
    <PortalProviderWithThemeAndIntlProviders
      onAnalyticsEvent={onAnalyticsEvent}
      useAnalyticsContext={useAnalyticsContext}
      render={render}
    />
  </IntlProviderIfMissingWrapper>
);

const PortalProviderWithThemeAndIntlProviders = ({
  onAnalyticsEvent,
  useAnalyticsContext,
  render,
}: PortalProviderWithThemeProvidersProps) => {
  const intl = useIntl();
  const globalTheme = useGlobalTheme();

  return (
    <BasePortalProvider
      intl={intl}
      themeMode={globalTheme.mode}
      onAnalyticsEvent={onAnalyticsEvent}
      useAnalyticsContext={useAnalyticsContext}
      render={render}
    />
  );
};

export class PortalRenderer extends React.Component<
  { portalProviderAPI: PortalProviderAPI },
  PortalRendererState
> {
  constructor(props: { portalProviderAPI: PortalProviderAPI }) {
    super(props);
    props.portalProviderAPI.setContext(this);
    props.portalProviderAPI.on('update', this.handleUpdate);
    this.state = { portals: new Map() };
  }

  handleUpdate = (portals: Portals) => this.setState({ portals });

  render() {
    const { portals } = this.state;
    return (
      <>
        {Array.from(portals.entries()).map(([container, children]) =>
          createPortal(children, container),
        )}
      </>
    );
  }
}

/**
 * Wrapper to re-provide modern analytics context to ReactNodeViews.
 */
const dummyAnalyticsContext = {
  getAtlaskitAnalyticsContext() {},
  getAtlaskitAnalyticsEventHandlers() {},
};

const AnalyticsContextWrapper = class extends React.Component<any> {
  static contextTypes = {
    contextAdapter: PropTypes.object,
  };

  render() {
    const { value } = this.context.contextAdapter.analytics || {
      value: dummyAnalyticsContext,
    };
    return (
      <AnalyticsReactContext.Provider value={value}>
        {this.props.children}
      </AnalyticsReactContext.Provider>
    );
  }
};
