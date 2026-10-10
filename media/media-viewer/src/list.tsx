import React, { type Ref, useState, useRef } from 'react';

import type { Identifier } from '@atlaskit/media-client/identifier';
import type { MediaTraceContext } from '@atlaskit/media-common/analytics/types';
import { getRandomTelemetryId } from '@atlaskit/media-common/helpers';
import type { MediaFeatureFlags } from '@atlaskit/media-common/types';
import { hideControlsClassName } from '@atlaskit/media-ui/classNames';
import type { WithShowControlMethodProp } from '@atlaskit/media-ui/types';

import { type MediaViewerExtensions } from './components/types';
import Header from './headerWithIntl';
import { useIsInsetViewer } from './insetViewerContext';
import { ItemViewer } from './item-viewer';
import { Navigation } from './navigation';
import { HeaderWrapper, ItemStage, ListWrapper } from './styleWrappers';
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
		// Inset viewer only: the header's close button, and its sidebar toggle for focus handling.
		onHeaderClose?: () => void;
		sidebarToggleRef?: Ref<HTMLButtonElement>;
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
	onHeaderClose,
	sidebarToggleRef,
}: Props): React.JSX.Element => {
	const [selectedItem, setSelectedItem] = useState(defaultSelectedItem);
	const [previewCount, setPreviewCount] = useState(0);
	const [isArchiveSideBarVisible, setIsArchiveSideBarVisible] = useState(false);
	const traceContext = useRef<MediaTraceContext>({
		traceId: getRandomTelemetryId(),
	});
	const isInsetViewer = useIsInsetViewer();
	const ViewerWrapper = isInsetViewer ? ItemStage : React.Fragment;

	return (
		<ListWrapper>
			<HeaderWrapper
				// The inset header stays visible, so it doesn't auto-hide with the other controls.
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={isInsetViewer ? undefined : hideControlsClassName}
				isArchiveSideBarVisible={isArchiveSideBarVisible}
			>
				<Header
					identifier={selectedItem}
					onClose={onHeaderClose ?? onClose}
					extensions={extensions}
					onSidebarButtonClick={onSidebarButtonClick}
					isSidebarVisible={isSidebarVisible}
					isArchiveSideBarVisible={isArchiveSideBarVisible}
					featureFlags={featureFlags}
					onSetArchiveSideBarVisible={setIsArchiveSideBarVisible}
					traceContext={traceContext.current}
					fallbackMediaNameFetcher={fallbackMediaNameFetcher}
					sidebarToggleRef={sidebarToggleRef}
				/>
			</HeaderWrapper>
			<ViewerWrapper>
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
			</ViewerWrapper>
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
