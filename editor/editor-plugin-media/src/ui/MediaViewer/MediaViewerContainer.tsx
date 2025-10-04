/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment, useEffect, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { MediaClientConfig } from '@atlaskit/media-core/auth';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { isVideo } from '../../pm-plugins/utils/is-type';
import { getSelectedNearestMediaContainerNodeAttrsFunction } from '../../ui/toolbar/utils';

import { RenderMediaViewer } from './PortalWrapper';

const interactiveStyles = css({
	cursor: 'pointer',
});

type MediaViewerContainerProps = {
	children?: React.ReactNode;
	isEditorViewMode?: boolean;
	isInline?: boolean;
	isSelected?: boolean;
	mediaClientConfig: MediaClientConfig;
	mediaNode: PMNode;
	selectedMediaContainerNode: () => PMNode | undefined;
};
const mediaViewerContainerTestID = 'media-viewer-container-test';
export const MediaViewerContainer = ({
	mediaNode,
	selectedMediaContainerNode,
	mediaClientConfig,
	isEditorViewMode = false,
	isSelected = true,
	isInline = false,
	children,
}: MediaViewerContainerProps) => {
	const [showViewer, setShowMediaViewer] = useState(false);

	useEffect(() => {
		setShowMediaViewer(isSelected);
	}, [isSelected]);

	const selectedNodeAttrs = getSelectedNearestMediaContainerNodeAttrsFunction(
		selectedMediaContainerNode,
	);

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
						// eslint-disable-next-line @atlassian/a11y/click-events-have-key-events, @atlassian/a11y/interactive-element-not-keyboard-focusable, @atlassian/a11y/no-static-element-interactions
						<span
							onClick={showMediaViewer}
							css={interactiveStyles}
							data-testid={mediaViewerContainerTestID}
						>
							{children}
						</span>
					) : (
						// eslint-disable-next-line @atlassian/a11y/click-events-have-key-events, @atlassian/a11y/interactive-element-not-keyboard-focusable, @atlassian/a11y/no-static-element-interactions
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
