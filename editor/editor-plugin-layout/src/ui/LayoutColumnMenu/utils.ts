import { findOverflowScrollParent, type PopupPosition } from '@atlaskit/editor-common/ui';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export const LAYOUT_COLUMN_MENU_POPUP_OFFSET: [number, number] = [0, 4];

const getVisibleEditorAreaTop = (
	editorView: EditorView,
	scrollableElement?: HTMLElement,
): number => {
	const visibleEditorArea = scrollableElement || findOverflowScrollParent(editorView.dom);

	return Math.max(visibleEditorArea ? visibleEditorArea.getBoundingClientRect().top : 0, 0);
};

// Prefer opening above the column drag handle, but fall back below when the visible editor
// area does not have enough space above (for example near the top toolbar).
export const shouldOpenLayoutColumnMenuBelow = ({
	editorView,
	popup,
	scrollableElement,
	target,
}: {
	editorView: EditorView;
	popup: HTMLElement;
	scrollableElement?: HTMLElement;
	target: HTMLElement;
}): boolean => {
	const [, offsetY] = LAYOUT_COLUMN_MENU_POPUP_OFFSET;
	const spaceAbove =
		target.getBoundingClientRect().top - getVisibleEditorAreaTop(editorView, scrollableElement);
	const popupHeight = popup.getBoundingClientRect().height || popup.clientHeight;

	return spaceAbove <= popupHeight + offsetY;
};

export const calculateFallbackBottomPosition = (
	position: PopupPosition,
	target: HTMLElement,
	popup: HTMLElement,
): PopupPosition => {
	if (!(popup.offsetParent instanceof HTMLElement)) {
		return position;
	}

	const offsetParent = popup.offsetParent;
	const borderBottomWidth =
		parseInt(window.getComputedStyle(offsetParent).borderBottomWidth, 10) || 0;
	const { top: offsetParentTop } = offsetParent.getBoundingClientRect();
	const { top: targetTop, height: targetHeight } = target.getBoundingClientRect();
	const [, offsetY] = LAYOUT_COLUMN_MENU_POPUP_OFFSET;
	const top = Math.ceil(
		targetTop -
			offsetParentTop +
			targetHeight +
			(offsetParent === offsetParent.ownerDocument.body ? 0 : offsetParent.scrollTop) -
			borderBottomWidth +
			offsetY,
	);

	const positionWithoutBottom = { ...position };
	delete positionWithoutBottom.bottom;

	return {
		...positionWithoutBottom,
		top,
	};
};
