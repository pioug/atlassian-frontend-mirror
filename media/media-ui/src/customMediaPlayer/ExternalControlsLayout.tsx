/**
 * Inset Media Viewer only. Portals the player's timeline and left/right controls
 * into `controlsPortalElement` (the viewer footer controls).
 *
 * Overlay players do not use this. They keep the original ControlsWrapper layout
 * on the video.
 *
 * When the footer controls have not mounted yet, render nothing so overlay controls
 * do not flash.
 */
import React, { type ReactNode, type Ref } from 'react';
import { createPortal } from 'react-dom';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Flex } from '@atlaskit/primitives/compiled/flex';
import { token } from '@atlaskit/tokens';

const timeWrapperStyles = cssMap({
	root: {
		position: 'absolute',
		insetInline: token('space.0'),
		top: token('space.negative.200'),
		marginTop: token('space.0'),
		marginInline: token('space.0'),
		marginBottom: token('space.0'),
	},
});

const timebarWrapperStyles = cssMap({
	root: {
		position: 'relative',
		width: '100%',
	},
});

const layoutStyles = cssMap({
	root: {
		position: 'relative',
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	},
});

export const ExternalControlsLayout = ({
	videoControlsWrapperRef,
	controlsPortalElement,
	timeline,
	left,
	right,
}: {
	videoControlsWrapperRef?: Ref<HTMLDivElement>;
	controlsPortalElement?: HTMLElement | null;
	timeline: ReactNode;
	left: ReactNode;
	right: ReactNode;
}): React.JSX.Element | null => {
	if (!controlsPortalElement) {
		return null;
	}

	return createPortal(
		<Box ref={videoControlsWrapperRef} xcss={layoutStyles.root}>
			<Box xcss={timeWrapperStyles.root}>{timeline}</Box>
			<Flex alignItems="center" justifyContent="space-between" xcss={timebarWrapperStyles.root}>
				{left}
				{right}
			</Flex>
		</Box>,
		controlsPortalElement,
	);
};
