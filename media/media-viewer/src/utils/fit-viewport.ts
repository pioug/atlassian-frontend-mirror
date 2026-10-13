import { type Camera } from '@atlaskit/media-ui/camera/camera';
import { Rectangle } from '@atlaskit/media-ui/rectangle';

import { type ZoomLevel } from '../domain/zoomLevel';
import { INSET_VIEWER_GUTTER_PX } from '../styleWrappers';
import { zoomLevelAfterResize } from '../viewers/image/zoom-level-after-resize';

export type MediaViewportCenter = {
	x: number;
	y: number;
};

export type WrapperSize = {
	width: number;
	height: number;
};

export type WrapperScroll = {
	scrollLeft: number;
	scrollTop: number;
};

type ViewportRefit = {
	camera: Camera;
	zoomLevel: ZoomLevel;
};

export const insetFittedViewport = (el: HTMLElement): Rectangle => {
	const { clientWidth, clientHeight } = el;
	return new Rectangle(Math.max(0, clientWidth - INSET_VIEWER_GUTTER_PX * 2), clientHeight);
};

export const readViewportCenterOnMedia = (
	wrapper: HTMLElement,
	media: HTMLElement,
): MediaViewportCenter | undefined => {
	const mediaRect = media.getBoundingClientRect();
	if (mediaRect.width <= 0 || mediaRect.height <= 0) {
		return undefined;
	}

	const viewportCenter = viewportClientCenter(wrapper);
	return {
		x: (viewportCenter.x - mediaRect.left) / mediaRect.width,
		y: (viewportCenter.y - mediaRect.top) / mediaRect.height,
	};
};

export const readWrapperSize = (wrapper: HTMLElement): WrapperSize => ({
	width: wrapper.clientWidth,
	height: wrapper.clientHeight,
});

export const readWrapperScroll = (wrapper: HTMLElement): WrapperScroll => ({
	scrollLeft: wrapper.scrollLeft,
	scrollTop: wrapper.scrollTop,
});

// Scroll events don't say what scrolled the wrapper, so a scroll is the user's only when neither the
// browser nor the viewer did it. The browser moves the scroll position when the wrapper resizes, so
// the wrapper must still be the size the viewer last handled. The viewer's own scroll writes (zoom,
// drag and the center restore) land on the position its saved center belongs to, so the scroll
// must be somewhere else.
export const isUserScroll = (
	wrapper: HTMLElement,
	fittedSize: WrapperSize | undefined,
	savedViewportCenterScroll: WrapperScroll | undefined,
): boolean =>
	!!fittedSize &&
	wrapper.clientWidth === fittedSize.width &&
	wrapper.clientHeight === fittedSize.height &&
	!(
		savedViewportCenterScroll &&
		wrapper.scrollLeft === savedViewportCenterScroll.scrollLeft &&
		wrapper.scrollTop === savedViewportCenterScroll.scrollTop
	);

export const restoreViewportCenterOnMedia = (
	wrapper: HTMLElement,
	media: HTMLElement,
	center: MediaViewportCenter,
): void => {
	const mediaRect = media.getBoundingClientRect();
	if (mediaRect.width <= 0 || mediaRect.height <= 0) {
		return;
	}

	const viewportCenter = viewportClientCenter(wrapper);
	wrapper.scrollLeft = Math.round(
		wrapper.scrollLeft + (mediaRect.left + center.x * mediaRect.width - viewportCenter.x),
	);
	wrapper.scrollTop = Math.round(
		wrapper.scrollTop + (mediaRect.top + center.y * mediaRect.height - viewportCenter.y),
	);
};

export const refitViewport = ({
	wrapper,
	media,
	camera,
	zoomLevel,
	savedViewportCenter,
}: {
	wrapper: HTMLElement;
	media?: HTMLElement | null;
	camera: Camera;
	zoomLevel: ZoomLevel;
	savedViewportCenter?: MediaViewportCenter;
}): ViewportRefit | null => {
	const refit = calculateViewportRefit(camera, zoomLevel, insetFittedViewport(wrapper));
	if (!refit) {
		return null;
	}

	// Size the media for the new fit now. Waiting for the next render leaves it a frame behind the
	// wrapper, and the center below is read from the media's layout.
	if (media) {
		const { width, height } = refit.camera.scaledImg(refit.zoomLevel.value);
		media.style.width = `${width}px`;
		media.style.height = `${height}px`;
	}

	const isZoomed =
		Number.isFinite(zoomLevel.value) &&
		Number.isFinite(camera.scaleDownToFit) &&
		zoomLevel.value !== camera.scaleDownToFit;

	if (isZoomed && savedViewportCenter && media) {
		restoreViewportCenterOnMedia(wrapper, media, savedViewportCenter);
	}

	return refit;
};

const viewportClientCenter = (wrapper: HTMLElement) => {
	const rect = wrapper.getBoundingClientRect();
	return {
		x: rect.left + wrapper.clientLeft + wrapper.clientWidth / 2,
		y: rect.top + wrapper.clientTop + wrapper.clientHeight / 2,
	};
};

const calculateViewportRefit = (
	camera: Camera,
	zoomLevel: ZoomLevel,
	nextViewport: Rectangle,
): ViewportRefit | null => {
	if (nextViewport.width <= 0 || nextViewport.height <= 0) {
		return null;
	}
	if (
		nextViewport.width === camera.viewport.width &&
		nextViewport.height === camera.viewport.height
	) {
		return null;
	}
	const resizedCamera = camera.resizedViewport(nextViewport);
	return {
		camera: resizedCamera,
		zoomLevel: zoomLevelAfterResize(resizedCamera, camera, zoomLevel),
	};
};
