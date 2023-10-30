import React from 'react';
import { MediaClient, Identifier } from '@atlaskit/media-client';
import {
  hideControlsClassName,
  WithShowControlMethodProp,
} from '@atlaskit/media-ui';
import { ItemViewer } from './item-viewer';
import { HeaderWrapper, ListWrapper } from './styleWrappers';
import { Navigation } from './navigation';
import Header from './header';
import { MediaViewerExtensions } from './components/types';
import { MediaFeatureFlags } from '@atlaskit/media-common';

export type Props = Readonly<
  {
    onClose?: () => void;
    onNavigationChange?: (selectedItem: Identifier) => void;
    defaultSelectedItem: Identifier;
    items: Identifier[];
    mediaClient: MediaClient;
    extensions?: MediaViewerExtensions;
    onSidebarButtonClick?: () => void;
    isSidebarVisible?: boolean;
    contextId?: string;
    featureFlags?: MediaFeatureFlags;
  } & WithShowControlMethodProp
>;

export type State = {
  selectedItem: Identifier;
  previewCount: number;
  isArchiveSideBarVisible: boolean;
};

export class List extends React.Component<Props, State> {
  state: State = {
    selectedItem: this.props.defaultSelectedItem,
    previewCount: 0,
    isArchiveSideBarVisible: false,
  };

  render() {
    const { items } = this.props;

    return this.renderContent(items);
  }

  renderContent(items: Identifier[]) {
    const {
      mediaClient,
      onClose,
      showControls,
      extensions,
      onSidebarButtonClick,
      contextId,
      featureFlags,
      isSidebarVisible,
    } = this.props;
    const { selectedItem, isArchiveSideBarVisible } = this.state;

    return (
      <ListWrapper>
        <HeaderWrapper
          className={hideControlsClassName}
          isArchiveSideBarVisible={isArchiveSideBarVisible}
        >
          <Header
            mediaClient={mediaClient}
            identifier={selectedItem}
            onClose={onClose}
            extensions={extensions}
            onSidebarButtonClick={onSidebarButtonClick}
            isSidebarVisible={isSidebarVisible}
            isArchiveSideBarVisible={isArchiveSideBarVisible}
            featureFlags={featureFlags}
            onSetArchiveSideBarVisible={(isVisible: boolean) =>
              this.setState({ isArchiveSideBarVisible: isVisible })
            }
          />
        </HeaderWrapper>
        <ItemViewer
          mediaClient={mediaClient}
          identifier={selectedItem}
          showControls={showControls}
          onClose={onClose}
          previewCount={this.state.previewCount}
          contextId={contextId}
          featureFlags={featureFlags}
        />
        <Navigation
          items={items}
          selectedItem={selectedItem}
          onChange={this.onNavigationChange}
          isArchiveSideBarVisible={isArchiveSideBarVisible}
        />
      </ListWrapper>
    );
  }

  onNavigationChange = (selectedItem: Identifier) => {
    const { onNavigationChange, showControls } = this.props;
    if (onNavigationChange) {
      onNavigationChange(selectedItem);
    }
    if (showControls) {
      showControls();
    }

    this.setState({ selectedItem, previewCount: this.state.previewCount + 1 });
  };
}
