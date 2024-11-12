import React, { useState } from 'react';
import { type Identifier } from '@atlaskit/media-client';
import { hideControlsClassName, type WithShowControlMethodProp } from '@atlaskit/media-ui';
import { ItemViewer } from './item-viewer';
import { HeaderWrapper, ListWrapper } from './styleWrappers';
import { Navigation } from './navigation';
import { type MediaViewerExtensions } from './components/types';
import { type MediaFeatureFlags } from '@atlaskit/media-common';
import Header from './header';
import { type ViewerOptionsProps } from './viewerOptions';

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
		viewerOptions?: ViewerOptionsProps;
	} & WithShowControlMethodProp
>;

export type State = {
	selectedItem: Identifier;
	previewCount: number;
	isArchiveSideBarVisible: boolean;
};

export const List = ({
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
	viewerOptions,
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
				<Header
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
			<ItemViewer
				identifier={selectedItem}
				showControls={showControls}
				onClose={onClose}
				previewCount={previewCount}
				contextId={contextId}
				featureFlags={featureFlags}
				viewerOptions={viewerOptions}
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
