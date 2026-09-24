import React, { useState, useRef } from 'react';

import { type Identifier } from '@atlaskit/media-client';
import {
	type MediaFeatureFlags,
	type MediaTraceContext,
	getRandomTelemetryId,
} from '@atlaskit/media-common';
import { hideControlsClassName } from '@atlaskit/media-ui/classNames';
import type { WithShowControlMethodProp } from '@atlaskit/media-ui/types';

import { type MediaViewerExtensions } from './components/types';
import Header from './headerWithIntl';
import { ItemViewer } from './item-viewer';
import { Navigation } from './navigation';
import { HeaderWrapper, ListWrapper } from './styleWrappers';
import { type ViewerOptionsProps } from './viewerOptions';

export type Props = Readonly<
	{
		onClose?: () => void;
		onNavigationChange?: (selectedItem: Identifier) => void;
		/**
		 * If provided, the List delegates the decision to advance to the next/prev
		 * item to the consumer. The consumer must call `proceed()` to actually
		 * commit the navigation. If `proceed` is never called, the underlying
		 * displayed item does not change. Used by consumers that need to show a
		 * confirmation prompt (e.g. unsaved comment changes) before allowing
		 * navigation between media items.
		 */
		onNavigationRequest?: (selectedItem: Identifier, proceed: () => void) => void;
		defaultSelectedItem: Identifier;
		items: Identifier[];
		extensions?: MediaViewerExtensions;
		onSidebarButtonClick?: () => void;
		isSidebarVisible?: boolean;
		contextId?: string;
		featureFlags?: MediaFeatureFlags;
		viewerOptions?: ViewerOptionsProps;
		fallbackMediaNameFetcher?: (id: string) => Promise<string>;
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
	onNavigationRequest,
	items,
	viewerOptions,
	fallbackMediaNameFetcher,
}: Props): React.JSX.Element => {
	const [selectedItem, setSelectedItem] = useState(defaultSelectedItem);
	const [previewCount, setPreviewCount] = useState(0);
	const [isArchiveSideBarVisible, setIsArchiveSideBarVisible] = useState(false);
	const traceContext = useRef<MediaTraceContext>({
		traceId: getRandomTelemetryId(),
	});

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
					traceContext={traceContext.current}
					fallbackMediaNameFetcher={fallbackMediaNameFetcher}
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
				traceContext={traceContext.current}
			/>
			<Navigation
				items={items}
				selectedItem={selectedItem}
				onChange={(nextSelectedItem: Identifier) => {
					const commit = () => {
						onNavigationChange?.(nextSelectedItem);
						showControls?.();
						setSelectedItem(nextSelectedItem);
						setPreviewCount(previewCount + 1);
					};
					if (onNavigationRequest) {
						onNavigationRequest(nextSelectedItem, commit);
					} else {
						commit();
					}
				}}
				isArchiveSideBarVisible={isArchiveSideBarVisible}
			/>
		</ListWrapper>
	);
};
