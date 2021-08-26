import React from 'react';
import { SyntheticEvent } from 'react';
import { MediaClient, Identifier } from '@atlaskit/media-client';
import {
  MediaFeatureFlags,
  withMediaAnalyticsContext,
} from '@atlaskit/media-common';
import { IntlProvider, intlShape } from 'react-intl';
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
} from './analytics';
import { createModalEvent } from './analytics/events/screen/modal';
import { createClosedEvent } from './analytics/events/ui/closed';
import { ItemSource } from './domain';
import { List } from './list';
import { Collection } from './collection';
import { Content } from './content';
import { Blanket, SidebarWrapper } from './styled';
import { start } from 'perf-marks';
import { MediaViewerExtensions } from './components/types';
import { mediaViewerPopupClass } from './classnames';

export type Props = {
  onClose?: () => void;
  selectedItem?: Identifier;
  featureFlags?: MediaFeatureFlags;
  mediaClient: MediaClient;
  itemSource: ItemSource;
  extensions?: MediaViewerExtensions;
  contextId?: string;
} & WithAnalyticsEventsProps;

export interface State {
  isSidebarVisible: boolean;
  selectedIdentifier?: Identifier;
}

export class MediaViewerComponent extends React.Component<Props, State> {
  state: State = {
    isSidebarVisible: false,
  };

  static contextTypes = {
    intl: intlShape,
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
    const { itemSource, selectedItem } = this.props;

    if (itemSource.kind === 'COLLECTION') {
      return selectedItem;
    }

    const { items } = itemSource;
    const firstItem = items[0];

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

  render() {
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
          {this.renderContent()}
        </Content>
        {this.renderSidebar()}
      </Blanket>
    );

    return this.context.intl ? (
      content
    ) : (
      <IntlProvider locale="en">{content}</IntlProvider>
    );
  }

  private onNavigationChange = (selectedIdentifier: Identifier) => {
    this.setState({ selectedIdentifier });
  };

  private renderContent() {
    const {
      mediaClient,
      onClose,
      itemSource,
      extensions,
      contextId,
      featureFlags,
    } = this.props;
    const { isSidebarVisible } = this.state;

    if (itemSource.kind === 'COLLECTION') {
      return (
        <Collection
          pageSize={itemSource.pageSize}
          defaultSelectedItem={this.defaultSelectedItem}
          collectionName={itemSource.collectionName}
          mediaClient={mediaClient}
          onClose={onClose}
          extensions={extensions}
          onNavigationChange={this.onNavigationChange}
          onSidebarButtonClick={this.toggleSidebar}
          featureFlags={featureFlags}
        />
      );
    } else if (itemSource.kind === 'ARRAY') {
      const { items } = itemSource;

      return (
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
      );
    } else {
      return null as never;
    }
  }
}

export const MediaViewer = withMediaAnalyticsContext(
  {
    packageName,
    packageVersion,
    component,
    componentName,
  },
  {
    filterFeatureFlags: [
      'zipPreviews',
      'codeViewer',
      'poll_intervalMs',
      'poll_maxAttempts',
      'poll_backoffFactor',
      'poll_maxIntervalMs',
    ],
  },
)(withAnalyticsEvents()(MediaViewerComponent));
