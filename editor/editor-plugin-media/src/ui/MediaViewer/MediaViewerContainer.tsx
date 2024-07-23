/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment, useEffect, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { getSelectedNearestMediaContainerNodeAttrs } from '../../toolbar/utils';
import { type MediaPluginState } from '../../types';
import { isVideo } from '../../utils/is-type';

import { RenderMediaViewer } from './PortalWrapper';

const interactiveStyles = css({
	cursor: 'pointer',
});

type MediaViewerContainerProps = {
	mediaNode: PMNode;
	mediaPluginState: MediaPluginState;
	isEditorViewMode?: boolean;
	isSelected?: boolean;
	isInline?: boolean;
	children?: React.ReactNode;
};
export const mediaViewerContainerTestID = 'media-viewer-container-test';
export const MediaViewerContainer = ({
	mediaNode,
	mediaPluginState,
	isEditorViewMode = false,
	isSelected = true,
	isInline = false,
	children,
}: MediaViewerContainerProps) => {
	const [showViewer, setShowMediaViewer] = useState(false);

	useEffect(() => {
		setShowMediaViewer(isSelected);
	}, [isSelected]);

	const selectedNodeAttrs = getSelectedNearestMediaContainerNodeAttrs(mediaPluginState);
	const mediaClientConfig = mediaPluginState.mediaClientConfig;

	const showMediaViewer = () => {
		setShowMediaViewer(true);
	};

	const closeMediaViewer = () => {
		setShowMediaViewer(false);
	};

	const isVideoMedia = isVideo(mediaNode.firstChild?.attrs.__fileMimeType);
	const enableMediaViewer =
		getBooleanFF('platform.editor.media.preview-in-full-page') && isEditorViewMode;

	const shouldShowViewer =
		enableMediaViewer && showViewer && selectedNodeAttrs && mediaClientConfig && !isVideoMedia;

	return (
		<Fragment>
			{enableMediaViewer ? (
				<Fragment>
					{isInline ? (
						<span
							onClick={showMediaViewer}
							css={interactiveStyles}
							data-testid={mediaViewerContainerTestID}
						>
							{children}
						</span>
					) : (
						<div
							onClick={showMediaViewer}
							css={interactiveStyles}
							data-testid={mediaViewerContainerTestID}
						>
							{children}
						</div>
					)}

					{shouldShowViewer && (
						<RenderMediaViewer
							selectedNodeAttrs={selectedNodeAttrs}
							mediaClientConfig={mediaClientConfig}
							onClose={closeMediaViewer}
						/>
					)}
				</Fragment>
			) : (
				children
			)}
		</Fragment>
	);
};
