/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx, css } from '@compiled/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

import { useIsInsetViewer } from '../../insetViewerContext';
import type { Children } from './styleWrappers';

const sidebarItemWrapperStyles = css({
	width: '85%',
});

const insetViewerSidebarItemWrapperStyles = css({
	width: 'auto',
	flex: 1,
	// Lets the item shrink below its name's width, so a long name truncates instead of pushing the
	// download button out of the row.
	minWidth: 0,
});

export const SidebarItemWrapper = ({ children }: Children): JSX.Element => {
	const isInsetViewer = useIsInsetViewer();
	return (
		<div css={[sidebarItemWrapperStyles, isInsetViewer && insetViewerSidebarItemWrapperStyles]}>
			{children}
		</div>
	);
};
