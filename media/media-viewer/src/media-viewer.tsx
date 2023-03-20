import React from 'react';
import { SyntheticEvent } from 'react';
import { MediaClient, Identifier } from '@atlaskit/media-client';
import {
  MediaFeatureFlags,
  withMediaAnalyticsContext,
} from '@atlaskit/media-common';
import {
  IntlProvider,
  injectIntl,
  WrappedComponentProps,
} from 'react-intl-next';
import { Shortcut } from '@atlaskit/media-ui';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import {
  packageName,
  packageVersion,
  component,
  componentName,
  fireAnalytics,
  LOGGED_FEATURE_FLAGS,
} from './analytics';
import { createModalEvent } from './analytics/events/screen/modal';
import { createClosedEvent } from './analytics/events/ui/closed';
import { List } from './list';
import { Content } from './content';
import { Blanket, SidebarWrapper } from './styleWrappers';
import { start } from 'perf-marks';
import { MediaViewerExtensions } from './components/types';
import { mediaViewerPopupClass } from './classnames';
import ErrorMessage from './errorMessage';
import { MediaViewerError } from './errors';

export type Props = {
  onClose?: () => void;
  selectedItem?: Identifier;
  featureFlags?: MediaFeatureFlags;
  mediaClient: MediaClient;
  /**
   * TODO: https://product-fabric.atlassian.net/browse/MEX-2207
   * property should be mandatory
   */
  items?: Identifier[];
  extensions?: MediaViewerExtensions;
  contextId?: string;
} & WithAnalyticsEventsProps;

export interface State {
  isSidebarVisible: boolean;
  selectedIdentifier?: Identifier;
}

export class MediaViewerComponent extends React.Component<
  Props & WrappedComponentProps,
  State
> {
  state: State = {
    isSidebarVisible: false,
  };

  UNSAFE_componentWillMount() {
    fireAnalytics(createModalEvent(), this.props);
    start('MediaViewer.SessionDuration');
  }

  onShortcutClosed = () => {
    fireAnalytics(createClosedEvent('escKey'), this.props);
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }
  };

  onContentClose = (_e?: SyntheticEvent, analyticsEvent?: UIAnalyticsEvent) => {
    const { onClose } = this.props;
    if (
      analyticsEvent &&
      analyticsEvent.payload &&
      analyticsEvent.payload.actionSubject === 'button'
    ) {
      fireAnalytics(createClosedEvent('button'), this.props);
    }
    if (onClose) {
      onClose();
    }
  };

  private toggleSidebar = () => {
    this.setState({
      isSidebarVisible: !this.state.isSidebarVisible,
    });
  };

  private get defaultSelectedItem(): Identifier | undefined {
    const { items, selectedItem } = this.props;

    const firstItem = items?.[0];

    return selectedItem || firstItem;
  }

  renderSidebar = () => {
    const { extensions } = this.props;
    const { isSidebarVisible, selectedIdentifier } = this.state;
    const sidebardSelectedIdentifier =
      selectedIdentifier || this.defaultSelectedItem;

    if (
      sidebardSelectedIdentifier &&
      isSidebarVisible &&
      extensions &&
      extensions.sidebar
    ) {
      return (
        <SidebarWrapper data-testid="media-viewer-sidebar-content">
          {extensions.sidebar.renderer(sidebardSelectedIdentifier, {
            close: this.toggleSidebar,
          })}
        </SidebarWrapper>
      );
    }
  };

  /**
   * TODO: https://product-fabric.atlassian.net/browse/MEX-2207
   * This error message is simulating the current error thrown by the backend when consumer provides a collection as datasource.
   * This is displayed at this level when no items are provided from the parent component.
   * This error message should be removed when the deprecated API is removed.
   */
  renderError() {
    return (
      <ErrorMessage
        fileId={'undefined'}
        error={
          new MediaViewerError(
            'collection-fetch-metadata',
            new Error('collection as datasource is no longer supported'),
          )
        }
      />
    );
  }

  render() {
    const { mediaClient, onClose, items, extensions, contextId, featureFlags } =
      this.props;
    const { isSidebarVisible } = this.state;
    const content = (
      <Blanket
        data-testid="media-viewer-popup"
        className={mediaViewerPopupClass}
      >
        <Shortcut keyCode={27} handler={this.onShortcutClosed} />
        <Content
          isSidebarVisible={isSidebarVisible}
          onClose={this.onContentClose}
        >
          {!items ? (
            this.renderError()
          ) : (
            <List
              defaultSelectedItem={this.defaultSelectedItem || items[0]}
              items={items}
              mediaClient={mediaClient}
              onClose={onClose}
              extensions={extensions}
              onNavigationChange={this.onNavigationChange}
              onSidebarButtonClick={this.toggleSidebar}
              isSidebarVisible={isSidebarVisible}
              contextId={contextId}
              featureFlags={featureFlags}
            />
          )}
        </Content>
        {this.renderSidebar()}
      </Blanket>
    );

    return this.props.intl ? (
      content
    ) : (
      <IntlProvider locale="en">{content}</IntlProvider>
    );
  }

  private onNavigationChange = (selectedIdentifier: Identifier) => {
    this.setState({ selectedIdentifier });
  };
}

export const MediaViewer: React.ComponentType<Props> =
  withMediaAnalyticsContext(
    {
      packageName,
      packageVersion,
      component,
      componentName,
    },
    {
      filterFeatureFlags: LOGGED_FEATURE_FLAGS,
    },
  )(
    withAnalyticsEvents()(
      injectIntl(MediaViewerComponent, { enforceContext: false }),
    ),
  );
