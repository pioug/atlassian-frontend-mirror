import React, { type ReactNode, useCallback, useEffect, useRef } from 'react';

import { Camera } from '@atlaskit/media-ui/camera/camera';
import { InsetViewerProvider } from '@atlaskit/media-ui/insetViewerProvider';
import { Rectangle } from '@atlaskit/media-ui/rectangle';

import {
	useMediaFooterControls,
	useRegisterMediaFooterPlayerControls,
} from '../insetViewerContext';
import { CustomMediaPlayerWrapper, FittedVideoFrame } from '../styleWrappers';
import { insetFittedViewport } from '../utils/fit-viewport';

// What the frame passes to the player it renders.
export type InsetVideoPlayerProps = {
	controlsPortalElement: HTMLElement | null;
	onVideoElementChange: (video: HTMLVideoElement | null) => void;
};

type InsetVideoFrameProps = {
	'data-testid'?: string;
	renderPlayer: (props: InsetVideoPlayerProps) => ReactNode;
};

// The inset viewer's video layout: a frame fitted to the video's aspect ratio inside the stage, refit
// as the stage resizes, and a player with its controls in the media footer. Used by the video viewer
// and by video inside a zip file.
export const InsetVideoFrame = ({
	'data-testid': testId,
	renderPlayer,
}: InsetVideoFrameProps): React.JSX.Element => {
	const controlsPortalElement = useMediaFooterControls();
	useRegisterMediaFooterPlayerControls();
	const frameRef = useRef<HTMLDivElement | null>(null);
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const resizeObserverRef = useRef<ResizeObserver | null>(null);

	const fitFrame = useCallback(() => {
		const frame = frameRef.current;
		const wrapper = frame?.parentElement;
		const video = videoRef.current;
		if (!wrapper || !frame || !video || video.videoWidth <= 0 || video.videoHeight <= 0) {
			return;
		}

		const viewport = insetFittedViewport(wrapper);
		if (viewport.width <= 0 || viewport.height <= 0) {
			return;
		}

		const camera = new Camera(viewport, new Rectangle(video.videoWidth, video.videoHeight));
		const nextSize = camera.scaledImg(camera.scaleToFit);
		frame.style.width = `${nextSize.width}px`;
		frame.style.height = `${nextSize.height}px`;
	}, []);

	const unbindFrame = useCallback(() => {
		videoRef.current?.removeEventListener('loadedmetadata', fitFrame);
		resizeObserverRef.current?.disconnect();
		resizeObserverRef.current = null;
	}, [fitFrame]);

	const bindFrame = useCallback(() => {
		const frame = frameRef.current;
		const wrapper = frame?.parentElement;
		const video = videoRef.current;
		if (!wrapper || !frame || !video) {
			return;
		}

		video.addEventListener('loadedmetadata', fitFrame);
		if (typeof ResizeObserver !== 'undefined') {
			resizeObserverRef.current = new ResizeObserver(fitFrame);
			resizeObserverRef.current.observe(wrapper);
		}
		fitFrame();
	}, [fitFrame]);

	const setFrame = useCallback(
		(frame: HTMLDivElement | null) => {
			unbindFrame();
			frameRef.current = frame;
			bindFrame();
		},
		[bindFrame, unbindFrame],
	);

	const setVideo = useCallback(
		(video: HTMLVideoElement | null) => {
			unbindFrame();
			videoRef.current = video;
			bindFrame();
		},
		[bindFrame, unbindFrame],
	);

	useEffect(() => unbindFrame, [unbindFrame]);

	return (
		<CustomMediaPlayerWrapper data-testid={testId}>
			<FittedVideoFrame ref={setFrame}>
				<InsetViewerProvider isInsetViewer>
					{renderPlayer({ controlsPortalElement, onVideoElementChange: setVideo })}
				</InsetViewerProvider>
			</FittedVideoFrame>
		</CustomMediaPlayerWrapper>
	);
};
