/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports
import { css, jsx } from '@emotion/react';

const interactiveStyles = css({
	cursor: 'pointer',
});

type MediaViewerContainerProps = {
	children?: React.ReactNode;
	isEditorViewMode?: boolean;
	isInline?: boolean;
};
const mediaViewerContainerTestID = 'media-viewer-container-test';
export const MediaViewerContainer = ({
	isEditorViewMode = false,
	isInline = false,
	children,
}: MediaViewerContainerProps): jsx.JSX.Element => {
	return (
		<Fragment>
			{isEditorViewMode ? (
				<Fragment>
					{isInline ? (
						<span css={interactiveStyles} data-testid={mediaViewerContainerTestID} role="none">
							{children}
						</span>
					) : (
						<div css={interactiveStyles} data-testid={mediaViewerContainerTestID} role="none">
							{children}
						</div>
					)}
				</Fragment>
			) : (
				children
			)}
		</Fragment>
	);
};
