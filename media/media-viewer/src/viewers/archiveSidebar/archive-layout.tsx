/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useLayoutEffect } from 'react';

import { jsx, css } from '@compiled/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

import { useIsInsetViewer, useSetHasArchiveColumn } from '../../insetViewerContext';
import type { Children } from './styleWrappers';

const archiveLayoutStyles = css({
	display: 'flex',
	width: '100%',
	height: '100%',
});

export const ArchiveLayout = ({ children }: Children): JSX.Element => {
	const isInsetViewer = useIsInsetViewer();
	const setHasArchiveColumn = useSetHasArchiveColumn();

	// The file list shows whenever this layout does, so the header and footer continue its column.
	// A layout effect, so the header, footer and arrows update in the same frame the list appears.
	useLayoutEffect(() => {
		if (!isInsetViewer) {
			return;
		}
		setHasArchiveColumn(true);
		return () => setHasArchiveColumn(false);
	}, [isInsetViewer, setHasArchiveColumn]);

	return (
		<div css={archiveLayoutStyles} data-testid="archive-layout">
			{children}
		</div>
	);
};
