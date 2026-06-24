import { findOverflowScrollParent, type PopupPosition } from '@atlaskit/editor-common/ui';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

export const LAYOUT_COLUMN_MENU_POPUP_OFFSET: [number, number] = [0, 4];

// Gate OFF: small gap below the handle; Popup handles invert/nudge fallbacks.
export const LAYOUT_COLUMN_MENU_POPUP_OFFSET_BELOW: [number, number] = [0, 2];

type LayoutColumnMenuPositioningProps = {
	alignX: 'center' | undefined;
	alignY: 'top' | undefined;
	offset: [number, number];
	// Legacy (gate ON) only: manual below-flip via Popup's `onPositionCalculated`. Gate OFF
	// relies on Popup's built-in placement (nudge, not flip).
	useManualBelowFlip: boolean;
};

// Gate OFF: left-aligned, below the handle. Gate ON (legacy): centred, prefer above with manual flip.
export const getLayoutColumnMenuPositioningProps = (): LayoutColumnMenuPositioningProps => {
	if (!fg('platform_editor_layout_column_menu_kill_switch_1')) {
		return {
			alignX: undefined,
			alignY: undefined,
			offset: LAYOUT_COLUMN_MENU_POPUP_OFFSET_BELOW,
			useManualBelowFlip: false,
		};
	}

	return {
		alignX: 'center',
		alignY: 'top',
		offset: LAYOUT_COLUMN_MENU_POPUP_OFFSET,
		useManualBelowFlip: true,
	};
};

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
