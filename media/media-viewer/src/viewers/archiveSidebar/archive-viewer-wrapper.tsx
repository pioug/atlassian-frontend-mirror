/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx, css } from '@compiled/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

import { useIsInsetViewer } from '../../insetViewerContext';
import { ARCHIVE_SIDE_BAR_WIDTH } from './styleWrappers';
import type { Children } from './styleWrappers';

const archiveViewerWrapperStyles = css({
	position: 'absolute',
	top: 0,
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	left: `${ARCHIVE_SIDE_BAR_WIDTH}px`,
	right: 0,
	bottom: 0,
	alignItems: 'center',
	display: 'flex',
});

// The file list sits next to the preview in the inset viewer, not over its left edge.
const insetViewerArchiveViewerWrapperStyles = css({
	position: 'relative',
	flex: 1,
	// Lets the preview shrink below its content's width when the stage narrows, such as the fitted
	// video's pixel width, so the content refits instead of pushing the file list out.
	minWidth: 0,
	display: 'flex',
	alignItems: 'center',
});

export const ArchiveViewerWrapper = ({ children }: Children): JSX.Element => {
	const isInsetViewer = useIsInsetViewer();
	return (
		<div
			css={[
				!isInsetViewer && archiveViewerWrapperStyles,
				isInsetViewer && insetViewerArchiveViewerWrapperStyles,
			]}
		>
			{children}
		</div>
	);
};
