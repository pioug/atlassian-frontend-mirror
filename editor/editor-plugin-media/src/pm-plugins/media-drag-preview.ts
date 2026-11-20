import { token } from '@atlaskit/tokens';

/** Caps both sides so tall images stay as compact as wide ones. */
const PREVIEW_SIZE = '120px';
/** Keeps the preview below and to the right of the pointer so it does not hide the drop target. */
const POINTER_OFFSET = '12px';

/**
 * Replaces the browser's full-size, pointer-anchored image ghost with a small thumbnail that trails
 * the pointer, rounded like the image in the document. Leaves the native preview in place until
 * the image has loaded.
 */
export const setMediaDragPreview = (event: DragEvent, mediaElement: Element): void => {
	const image = mediaElement.querySelector('img');
	if (!event.dataTransfer || !image?.complete) {
		return;
	}
	const thumbnail = image.cloneNode(false);
	if (!(thumbnail instanceof HTMLImageElement)) {
		return;
	}
	thumbnail.removeAttribute('width');
	thumbnail.removeAttribute('height');
	// The preview is decorative; the dragged image keeps its own description.
	thumbnail.alt = '';
	Object.assign(thumbnail.style, {
		display: 'block',
		width: PREVIEW_SIZE,
		height: 'auto',
		maxHeight: PREVIEW_SIZE,
		objectFit: 'cover',
		borderRadius: token('radius.small'),
		boxShadow: token('elevation.shadow.overlay'),
	});

	// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage
	const container = document.createElement('div');
	Object.assign(container.style, {
		position: 'fixed',
		top: '0',
		left: '0',
		pointerEvents: 'none',
		borderInlineStart: `${POINTER_OFFSET} solid transparent`,
		borderTop: `${POINTER_OFFSET} solid transparent`,
	});
	container.append(thumbnail);
	// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage
	document.body.append(container);
	event.dataTransfer.setDragImage(container, 0, 0);
	// The browser captures the preview when dragstart finishes, so it can be removed straight after.
	requestAnimationFrame(() => container.remove());
};
