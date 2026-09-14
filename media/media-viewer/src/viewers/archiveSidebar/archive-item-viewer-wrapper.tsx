/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx, css } from '@compiled/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

import type { Children } from './styleWrappers';

const archiveItemViewerWrapperStyles = css({
	width: '100%',
	display: 'flex',
	justifyContent: 'center',
});

const fullHeightStyles = css({
	height: '100%',
});

export const ArchiveItemViewerWrapper = ({
	children,
	fullHeight,
}: Children & { fullHeight?: boolean }): JSX.Element => {
	return (
		<div css={[archiveItemViewerWrapperStyles, fullHeight && fullHeightStyles]}>{children}</div>
	);
};
