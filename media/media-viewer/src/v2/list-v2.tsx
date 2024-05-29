import React, { useState } from 'react';
import { type Identifier } from '@atlaskit/media-client';
import {
  hideControlsClassName,
  type WithShowControlMethodProp,
} from '@atlaskit/media-ui';
import { ItemViewerV2 } from './item-viewer-v2';
import { HeaderWrapper, ListWrapper } from '../styleWrappers';
import { Navigation } from '../navigation';
import { type MediaViewerExtensions } from '../components/types';
import { type MediaFeatureFlags } from '@atlaskit/media-common';
import HeaderV2 from './header-v2';

export type Props = Readonly<
  {
    onClose?: () => void;
    onNavigationChange?: (selectedItem: Identifier) => void;
    defaultSelectedItem: Identifier;
    items: Identifier[];
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

export const ListV2 = ({
  defaultSelectedItem,
  onClose,
  showControls,
  extensions,
  onSidebarButtonClick,
  contextId,
  featureFlags,
  isSidebarVisible,
  onNavigationChange,
  items,
}: Props) => {
  const [selectedItem, setSelectedItem] = useState(defaultSelectedItem);
  const [previewCount, setPreviewCount] = useState(0);
  const [isArchiveSideBarVisible, setIsArchiveSideBarVisible] = useState(false);

  return (
    <ListWrapper>
      <HeaderWrapper
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
        className={hideControlsClassName}
        isArchiveSideBarVisible={isArchiveSideBarVisible}
      >
        <HeaderV2
          identifier={selectedItem}
          onClose={onClose}
          extensions={extensions}
          onSidebarButtonClick={onSidebarButtonClick}
          isSidebarVisible={isSidebarVisible}
          isArchiveSideBarVisible={isArchiveSideBarVisible}
          featureFlags={featureFlags}
          onSetArchiveSideBarVisible={setIsArchiveSideBarVisible}
        />
      </HeaderWrapper>
      <ItemViewerV2
        identifier={selectedItem}
        showControls={showControls}
        onClose={onClose}
        previewCount={previewCount}
        contextId={contextId}
        featureFlags={featureFlags}
      />
      <Navigation
        items={items}
        selectedItem={selectedItem}
        onChange={(selectedItem: Identifier) => {
          onNavigationChange?.(selectedItem);
          showControls?.();
          setSelectedItem(selectedItem);
          setPreviewCount(previewCount + 1);
        }}
        isArchiveSideBarVisible={isArchiveSideBarVisible}
      />
    </ListWrapper>
  );
};
