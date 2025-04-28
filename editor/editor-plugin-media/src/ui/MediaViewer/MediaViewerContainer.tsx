/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment, useEffect, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { isVideo } from '../../pm-plugins/utils/is-type';
import { type MediaPluginState } from '../../types';
import { getSelectedNearestMediaContainerNodeAttrs } from '../../ui/toolbar/utils';

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
const mediaViewerContainerTestID = 'media-viewer-container-test';
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

	const shouldShowViewer =
		isEditorViewMode &&
		showViewer &&
		selectedNodeAttrs &&
		mediaClientConfig &&
		!isVideoMedia &&
		editorExperiment('platform_editor_controls', 'control');

	return (
		<Fragment>
			{isEditorViewMode ? (
				<Fragment>
					{isInline ? (
						// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, @atlassian/a11y/interactive-element-not-keyboard-focusable
						<span
							onClick={showMediaViewer}
							css={interactiveStyles}
							data-testid={mediaViewerContainerTestID}
						>
							{children}
						</span>
					) : (
						// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, @atlassian/a11y/interactive-element-not-keyboard-focusable
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
