/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment, useEffect, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports
import { css, jsx } from '@emotion/react';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { MediaClientConfig } from '@atlaskit/media-core/auth';
import type { MediaViewerExtensions } from '@atlaskit/media-viewer';
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
	mediaViewerExtensions?: MediaViewerExtensions;
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
	mediaViewerExtensions,
	children,
}: MediaViewerContainerProps): jsx.JSX.Element => {
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
						<span
							onClick={showMediaViewer}
							css={interactiveStyles}
							data-testid={mediaViewerContainerTestID}
							role="none"
						>
							{children}
						</span>
					) : (
						<div
							onClick={showMediaViewer}
							css={interactiveStyles}
							data-testid={mediaViewerContainerTestID}
							role="none"
						>
							{children}
						</div>
					)}

					{shouldShowViewer && (
						<RenderMediaViewer
							selectedNodeAttrs={selectedNodeAttrs}
							mediaClientConfig={mediaClientConfig}
							onClose={closeMediaViewer}
							extensions={mediaViewerExtensions}
						/>
					)}
				</Fragment>
			) : (
				children
			)}
		</Fragment>
	);
};
