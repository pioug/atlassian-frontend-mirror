import React, {
	type CSSProperties,
	useState,
	useRef,
	useEffect,
	useCallback,
	useLayoutEffect,
} from 'react';

import { useIntl } from 'react-intl';

import withAnalyticsEvents, {
	type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next/withAnalyticsEvents';
import type { FileIdentifier } from '@atlaskit/media-client/identifier';
import type { MediaTraceContext } from '@atlaskit/media-common/analytics/types';
import { ANALYTICS_MEDIA_CHANNEL } from '@atlaskit/media-common/constants';
import MediaSvg from '@atlaskit/media-svg/media-svg';
import type { MediaSVGError } from '@atlaskit/media-svg/media-svg-error';
import { Camera } from '@atlaskit/media-ui/camera/camera';
import { messages } from '@atlaskit/media-ui/messages';
import { Vector2 } from '@atlaskit/media-ui/vector2';
import { token } from '@atlaskit/tokens';

import { createClosedEvent } from '../../analytics/events/ui/closed';
import { ZoomLevel } from '../../domain/zoomLevel';
import { useIsInsetViewer } from '../../insetViewerContext';
import { MediaViewerError } from '../../MediaViewerError';
import { BaselineExtend } from '../../styleWrappers';
import {
	refitViewport,
	insetFittedViewport,
	isUserScroll,
	readWrapperScroll,
	readWrapperSize,
	readViewportCenterOnMedia,
	type MediaViewportCenter,
	type WrapperScroll,
	type WrapperSize,
} from '../../utils/fit-viewport';
import { ZoomControls } from '../../zoomControls';
import { clientRectangle } from './clientRectangle';
import { getErrorReason } from './errors';
import { ImageWrapper } from './ImageWrapper';
import { naturalSizeRectangle } from './naturalSizeRectangle';
import { zoomLevelAfterResize } from './zoomLevelAfterResize';

export interface SvgViewerProps extends WithAnalyticsEventsProps {
	identifier: FileIdentifier;
	onClose?: () => void;
	onLoad?: () => void;
	onError: (error: MediaViewerError) => void;
	onBlanketClicked?: () => void;
	traceContext?: MediaTraceContext;
}

const SvgViewerBase = ({
	identifier,
	onLoad,
	onClose,
	onBlanketClicked,
	onError,
}: SvgViewerProps) => {
	const [zoomLevel, setZoomLevel] = useState(new ZoomLevel(1));
	const [isDragging, setIsDragging] = useState(false);
	const [cursorPos, setCursorPos] = useState(new Vector2(0, 0));
	const [camera, setCamera] = useState<Camera>();
	const wrapperRef = useRef<HTMLDivElement>(null);
	const imageRef = useRef<HTMLImageElement>(null);
	const savedViewportCenterRef = useRef<MediaViewportCenter | undefined>(undefined);
	// The wrapper scroll position the saved center was read at or restored to.
	const savedViewportCenterScrollRef = useRef<WrapperScroll | undefined>(undefined);
	// The wrapper size the last load or resize was handled at.
	const fittedWrapperSizeRef = useRef<WrapperSize | undefined>(undefined);
	const [wrapperScroll, setWrapperScroll] = useState<WrapperScroll>();
	const intl = useIntl();
	const isInsetViewer = useIsInsetViewer();

	const captureViewportCenterOnMedia = (wrapper: HTMLElement, image: HTMLElement) => {
		savedViewportCenterRef.current = readViewportCenterOnMedia(wrapper, image);
		savedViewportCenterScrollRef.current = readWrapperScroll(wrapper);
	};

	const onResize = useCallback(() => {
		if (!wrapperRef.current || !camera) {
			return;
		}
		if (!isInsetViewer) {
			const newViewport = clientRectangle(wrapperRef.current);
			const newCamera = camera.resizedViewport(newViewport);
			const newZoomLevel = zoomLevelAfterResize(newCamera, camera, zoomLevel);
			setCamera(newCamera);
			setZoomLevel(newZoomLevel);
			return;
		}

		fittedWrapperSizeRef.current = readWrapperSize(wrapperRef.current);
		const refit = refitViewport({
			wrapper: wrapperRef.current,
			media: imageRef.current,
			camera,
			zoomLevel,
			savedViewportCenter: savedViewportCenterRef.current,
		});
		if (!refit) {
			return;
		}
		savedViewportCenterScrollRef.current = readWrapperScroll(wrapperRef.current);
		setCamera(refit.camera);
		setZoomLevel(refit.zoomLevel);
	}, [isInsetViewer, camera, zoomLevel]);

	const panImage = useCallback(
		(ev: MouseEvent) => {
			if (isDragging && wrapperRef.current) {
				const newCursorPos = new Vector2(ev.screenX, ev.screenY);
				const delta = cursorPos.sub(newCursorPos);
				setCursorPos(newCursorPos);
				wrapperRef.current.scrollLeft += delta.x;
				wrapperRef.current.scrollTop += delta.y;
				if (isInsetViewer && imageRef.current) {
					captureViewportCenterOnMedia(wrapperRef.current, imageRef.current);
				}
			}
		},
		[cursorPos, isDragging, isInsetViewer],
	);

	const stopDragging = useCallback((ev: MouseEvent) => {
		ev.preventDefault();
		setIsDragging(false);
	}, []);

	useEffect(() => {
		const shouldListenForWindowResize = !isInsetViewer || typeof ResizeObserver === 'undefined';
		if (shouldListenForWindowResize) {
			window.addEventListener('resize', onResize);
		}
		document.addEventListener('mousemove', panImage);
		document.addEventListener('mouseup', stopDragging);

		return () => {
			if (shouldListenForWindowResize) {
				window.removeEventListener('resize', onResize);
			}
			document.removeEventListener('mousemove', panImage);
			document.removeEventListener('mouseup', stopDragging);
		};
	}, [isInsetViewer, onResize, panImage, stopDragging]);

	// The observer calls the latest `onResize` through a ref, so it isn't recreated every time the
	// media is zoomed.
	const onResizeRef = useRef(onResize);
	useLayoutEffect(() => {
		onResizeRef.current = onResize;
	}, [onResize]);

	// Inset only: observes the wrapper's size, and saves the center after the user scrolls it natively
	// (wheel, trackpad, scrollbar, keyboard or touch), which doesn't go through the zoom or drag handlers.
	useEffect(() => {
		const wrapper = wrapperRef.current;
		if (!wrapper || !isInsetViewer) {
			return;
		}
		const onWrapperScroll = () => {
			if (
				!imageRef.current ||
				!isUserScroll(wrapper, fittedWrapperSizeRef.current, savedViewportCenterScrollRef.current)
			) {
				return;
			}
			captureViewportCenterOnMedia(wrapper, imageRef.current);
		};
		wrapper.addEventListener('scroll', onWrapperScroll);

		const observer =
			typeof ResizeObserver === 'undefined'
				? undefined
				: new ResizeObserver(() => onResizeRef.current());
		observer?.observe(wrapper);

		return () => {
			wrapper.removeEventListener('scroll', onWrapperScroll);
			observer?.disconnect();
		};
	}, [isInsetViewer]);

	const onSvgLoad = (ev: React.SyntheticEvent<HTMLImageElement>) => {
		onLoad?.();

		if (!wrapperRef.current) {
			return;
		}

		const viewport = isInsetViewer
			? insetFittedViewport(wrapperRef.current)
			: clientRectangle(wrapperRef.current);
		if (isInsetViewer) {
			fittedWrapperSizeRef.current = readWrapperSize(wrapperRef.current);
		}
		const originalImgRect = naturalSizeRectangle(ev.currentTarget);
		const newCamera = new Camera(viewport, originalImgRect);
		const newZoomLevel = new ZoomLevel(newCamera.scaleDownToFit);

		setCamera(newCamera);
		setZoomLevel(newZoomLevel);
	};

	const onSvgError = (err: MediaSVGError) => {
		const error = new MediaViewerError(getErrorReason(err.primaryReason), err.secondaryError);
		onError(error);
	};

	const onSvgClicked = (e: React.MouseEvent) => {
		if (isInsetViewer) {
			return;
		}
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

	// Fits to the camera's current viewport. A zoom level's initial value is the fit from when it was
	// created, which is stale once the wrapper has resized while the media was zoomed.
	const onResetZoom = () => {
		if (camera) {
			onZoomChange(new ZoomLevel(camera.scaleDownToFit));
		}
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
		if (isInsetViewer && imageRef.current) {
			captureViewportCenterOnMedia(wrapper, imageRef.current);
		}
	}, [isInsetViewer, wrapperScroll]);

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
		...(isInsetViewer && { borderRadius: token('radius.large', '8px'), overflow: 'hidden' }),
	};
	const imgDimensions = camera?.scaledImg(zoomLevel.value);

	return (
		<ImageWrapper
			onClick={onSvgClicked}
			ref={wrapperRef}
			// Prevents scrollbars while loading or fitted.
			isHidden={
				isHidden || !!(isInsetViewer && camera && zoomLevel.value === camera.scaleDownToFit)
			}
		>
			<MediaSvg
				ref={imageRef}
				testId={'media-viewer-svg'}
				alt={intl.formatMessage(messages.svg_base_alt)}
				identifier={identifier}
				dimensions={imgDimensions}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={imgStyles}
				onLoad={onSvgLoad}
				onMouseDown={startDragging}
				onError={onSvgError}
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
			<ZoomControls
				zoomLevel={zoomLevel}
				onChange={onZoomChange}
				onResetZoom={isInsetViewer ? onResetZoom : undefined}
			/>
		</ImageWrapper>
	);
};

export const SvgViewer: React.ForwardRefExoticComponent<
	Omit<SvgViewerProps, keyof WithAnalyticsEventsProps> & React.RefAttributes<any>
> = withAnalyticsEvents({
	onBlanketClicked: (createAnalyticsEvent) => {
		const event = createAnalyticsEvent(createClosedEvent('blanket'));
		event.fire(ANALYTICS_MEDIA_CHANNEL);
	},
})(SvgViewerBase);
