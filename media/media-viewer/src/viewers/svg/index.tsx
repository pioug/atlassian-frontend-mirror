import React, {
	type CSSProperties,
	useState,
	useRef,
	useEffect,
	useCallback,
	useLayoutEffect,
} from 'react';
import { Camera, Vector2 } from '@atlaskit/media-ui';
import { ANALYTICS_MEDIA_CHANNEL, type MediaTraceContext } from '@atlaskit/media-common';
import { type FileIdentifier } from '@atlaskit/media-client';

import { withAnalyticsEvents, type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';

import { BaselineExtend } from '../../styleWrappers';
import { ZoomLevel } from '../../domain/zoomLevel';

import { ZoomControls } from '../../zoomControls';
import { createClosedEvent } from '../../analytics/events/ui/closed';
import MediaSvg from '@atlaskit/media-svg';
import { type MediaViewerError } from '../../errors';
import { clientRectangle, naturalSizeRectangle, zoomLevelAfterResize } from './utils';
import { ImageWrapper } from './ImageWrapper';

type WrapperScroll = {
	scrollLeft: number;
	scrollTop: number;
};

export interface SvgViewerProps extends WithAnalyticsEventsProps {
	identifier: FileIdentifier;
	onClose?: () => void;
	onLoad?: () => void;
	onError: (error: MediaViewerError) => void;
	onBlanketClicked?: () => void;
	traceContext?: MediaTraceContext;
}

const SvgViewerBase = ({ identifier, onLoad, onClose, onBlanketClicked }: SvgViewerProps) => {
	const [zoomLevel, setZoomLevel] = useState(new ZoomLevel(1));
	const [isDragging, setIsDragging] = useState(false);
	const [cursorPos, setCursorPos] = useState(new Vector2(0, 0));
	const [camera, setCamera] = useState<Camera>();
	const wrapperRef = useRef<HTMLDivElement>(null);
	const [wrapperScroll, setWrapperScroll] = useState<WrapperScroll>();

	const onResize = useCallback(() => {
		if (!wrapperRef.current || !camera) {
			return;
		}
		const newViewport = clientRectangle(wrapperRef.current);
		const newCamera = camera.resizedViewport(newViewport);
		const newZoomLevel = zoomLevelAfterResize(newCamera, camera, zoomLevel);
		setCamera(newCamera);
		setZoomLevel(newZoomLevel);
	}, [camera, zoomLevel]);

	const panImage = useCallback(
		(ev: MouseEvent) => {
			if (isDragging && wrapperRef.current) {
				const newCursorPos = new Vector2(ev.screenX, ev.screenY);
				const delta = cursorPos.sub(newCursorPos);
				setCursorPos(newCursorPos);
				wrapperRef.current.scrollLeft += delta.x;
				wrapperRef.current.scrollTop += delta.y;
			}
		},
		[cursorPos, isDragging],
	);

	const stopDragging = useCallback((ev: MouseEvent) => {
		ev.preventDefault();
		setIsDragging(false);
	}, []);

	useEffect(() => {
		window.addEventListener('resize', onResize);
		document.addEventListener('mousemove', panImage);
		document.addEventListener('mouseup', stopDragging);

		return () => {
			window.removeEventListener('resize', onResize);
			document.removeEventListener('mousemove', panImage);
			document.removeEventListener('mouseup', stopDragging);
		};
	}, [onResize, panImage, stopDragging]);

	const onImgLoad = (ev: React.SyntheticEvent<HTMLImageElement>) => {
		onLoad?.();

		if (!wrapperRef.current) {
			return;
		}

		const viewport = clientRectangle(wrapperRef.current);
		const originalImgRect = naturalSizeRectangle(ev.currentTarget);
		const newCamera = new Camera(viewport, originalImgRect);
		const newZoomLevel = new ZoomLevel(newCamera.scaleDownToFit);

		setCamera(newCamera);
		setZoomLevel(newZoomLevel);
	};

	const onImgClicked = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onBlanketClicked?.();
			onClose?.();
		}
	};

	const startDragging = (ev: React.MouseEvent<HTMLImageElement>) => {
		// stopping propagation to prevent media viewer from closing
		// when clicking on the image
		ev.stopPropagation();
		ev.preventDefault();
		setIsDragging(true);
		setCursorPos(new Vector2(ev.screenX, ev.screenY));
	};

	const onZoomChange = (nextZoomLevel: ZoomLevel) => {
		const { current: wrapper } = wrapperRef;
		if (!wrapper || !camera) {
			return;
		}
		const { scrollLeft, scrollTop } = wrapper;
		const prevOffset = new Vector2(scrollLeft, scrollTop);
		const prevZoomLevel = zoomLevel;

		setZoomLevel(nextZoomLevel);

		const { x, y } = camera.scaledOffset(prevOffset, prevZoomLevel.value, nextZoomLevel.value);
		setWrapperScroll({ scrollLeft: x, scrollTop: y });
	};

	useLayoutEffect(() => {
		// Must scroll after the new zoom (onZoomChange) and before the repaint
		const { current: wrapper } = wrapperRef;
		if (!wrapper || !wrapperScroll) {
			return;
		}
		const { scrollLeft, scrollTop } = wrapperScroll;
		wrapper.scrollLeft = scrollLeft;
		wrapper.scrollTop = scrollTop;
	}, [wrapperScroll]);

	// We use style attr instead of SC prop for perf reasons
	// When image loads it does two things at the same time 1) it renders itself in the browser 2) triggers onLoad
	// visibility: 'hidden' is here to prevent image rendering on the screen (with 100%) before next
	// react re-render when we have `camera` and can control it's zoom level.
	// overflow: 'hidden' is here to prevent scroll going wild while image is rendered in visibility: 'hidden'
	// We can't use display: none or not render image, because we do need `onLoad` to trigger and read it's dimensions

	const canDrag = (camera && zoomLevel.value > camera.scaleToFit) || false;
	const isHidden = !camera;
	const imgStyles: CSSProperties = {
		visibility: isHidden ? 'hidden' : 'visible',
		cursor: canDrag && isDragging ? 'grabbing' : canDrag ? 'grab' : 'initial',
		display: 'inline-block',
		verticalAlign: 'middle',
		position: 'relative',
	};
	const imgDimensions = camera?.scaledImg(zoomLevel.value);

	return (
		<ImageWrapper onClick={onImgClicked} ref={wrapperRef} isHidden={isHidden}>
			<MediaSvg
				testId={'media-viewer-svg'}
				identifier={identifier}
				dimensions={imgDimensions}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={imgStyles}
				onLoad={onImgLoad}
				onMouseDown={startDragging}
				// TODO HANDLE ERRORS
				onError={() => {
					// onError();
				}}
			/>
			{/*
          The BaselineExtend element is required to align the Img element in the
          vertical center of the page. It ensures that the parent container is
          at least 100% of the viewport height and makes it possible to set
          vertical-align: middle on the image.
          We can convert the ImageWrapper to display as flex and center the content,
          but the scrolling does not work well if justify-content does not include the keyword 'safe'
          `justify-content: safe center`
          Currently 'safe' is not supported by Safari
         */}
			<BaselineExtend />
			<ZoomControls zoomLevel={zoomLevel} onChange={onZoomChange} />
		</ImageWrapper>
	);
};

export const SvgViewer = withAnalyticsEvents({
	onBlanketClicked: (createAnalyticsEvent) => {
		const event = createAnalyticsEvent(createClosedEvent('blanket'));
		event.fire(ANALYTICS_MEDIA_CHANNEL);
	},
})(SvgViewerBase);
