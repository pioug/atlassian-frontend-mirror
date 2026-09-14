/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx, css } from '@compiled/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

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

export const ArchiveViewerWrapper = ({ children }: Children): JSX.Element => {
	return <div css={archiveViewerWrapperStyles}>{children}</div>;
};
