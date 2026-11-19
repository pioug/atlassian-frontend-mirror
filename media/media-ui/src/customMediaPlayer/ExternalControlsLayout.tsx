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

import { ControlsLayout } from './ControlsLayout';

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
		<ControlsLayout
			videoControlsWrapperRef={videoControlsWrapperRef}
			timeline={timeline}
			left={left}
			right={right}
		/>,
		controlsPortalElement,
	);
};
