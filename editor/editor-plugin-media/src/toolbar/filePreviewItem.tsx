import React, { useState } from 'react';

import type { IntlShape } from 'react-intl-next';

import { FloatingToolbarButton as ToolbarButton } from '@atlaskit/editor-common/ui';
import FilePreviewIcon from '@atlaskit/icon/glyph/editor/file-preview';
import { messages } from '@atlaskit/media-ui';

import type { MediaPluginState } from '../pm-plugins/types';
import { RenderMediaViewer } from '../ui/MediaViewer/PortalWrapper';

import { getSelectedNearestMediaContainerNodeAttrs } from './utils';

interface FilePreviewProps {
	mediaPluginState: MediaPluginState;
	intl: IntlShape;
}

// This function will eventially be removed when platform_editor_media_previewer_bugfix is cleaned up
export const FilePreviewItem = ({ mediaPluginState, intl }: FilePreviewProps) => {
	const [isMediaViewerVisible, setMediaViewerVisible] = useState(false);
	const showMediaViewer = () => {
		setMediaViewerVisible(true);
	};
	const onMediaViewerClose = () => {
		setMediaViewerVisible(false);
	};
	const selectedNodeAttrs = getSelectedNearestMediaContainerNodeAttrs(mediaPluginState);
	const shouldRenderMediaViewer =
		selectedNodeAttrs && mediaPluginState.mediaClientConfig && isMediaViewerVisible;
	const tooltipContent = intl.formatMessage(messages.preview);
	return (
		<>
			<ToolbarButton
				testId="file-preview-toolbar-button"
				key="editor.media.card.preview"
				onClick={showMediaViewer}
				icon={<FilePreviewIcon label="file preview" />}
				tooltipContent={tooltipContent}
			/>
			{shouldRenderMediaViewer && (
				<RenderMediaViewer
					mediaClientConfig={mediaPluginState.mediaClientConfig!}
					onClose={onMediaViewerClose}
					selectedNodeAttrs={selectedNodeAttrs}
				/>
			)}
		</>
	);
};
