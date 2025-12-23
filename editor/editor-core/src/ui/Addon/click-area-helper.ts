import { tintDirtyTransaction } from '@atlaskit/editor-common/collab';
import { addParagraphAtEnd } from '@atlaskit/editor-common/commands';
import { setSelectionTopLevelBlocks } from '@atlaskit/editor-common/selection';
import { closestElement } from '@atlaskit/editor-common/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { ignoreAttribute } from './ClickAreaBlock/contentComponentWrapper';

// we ignore all of the clicks made inside <div class="ak-editor-content-area" /> (but not clicks on the node itself)
const insideContentArea = (ref: HTMLElement | null): boolean => {
	while (ref) {
		if (ref.classList && ref.classList.contains('ak-editor-content-area')) {
			return true;
		}
		// Ignored via go/ees005
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		ref = ref.parentNode as HTMLElement;
	}
	return false;
};

const insideProseMirrorEditableArea = (ref: HTMLElement | null): boolean => {
	return Boolean(ref?.closest('.ProseMirror'));
};

/**
 * @see ED-14699 - check if editor is inside a modal to continue to bring cursor to input when
 * any part of the editor container is clicked
 *
 * Handles two cases when a click event is fired:
 *
 * 1. if editor (e.g. comment inside of Jira ticket view) is inside modal then ensure focus and cursor is brought to the input
 * 2. if another modal is open (e.g. delete confirmation modal for confluence table) then ignore clicks as they shouldn't influence editor state
 */
export const checkForModal = (target: HTMLElement | null) => {
	const modalDialog = target?.closest('[role=dialog]');

	if (modalDialog) {
		// return false if not an editor inside modal, otherwise return true
		return !!modalDialog?.querySelector('.akEditor');
	}

	// no modal present so we can return true
	return true;
};

const clickAreaClickHandler = (view: EditorView, event: React.MouseEvent<HTMLElement>) => {
	const isEditorFocused = !!view?.hasFocus?.();

	if (!(event.target instanceof HTMLElement)) {
		return;
	}

	// Ignored via go/ees005
	// eslint-disable-next-line @atlaskit/editor/no-as-casting
	const target = event.target as HTMLElement;
	const isTargetContentArea = target?.classList.contains('ak-editor-content-area');

	const isTargetChildOfContentArea = insideContentArea(
		target?.parentNode instanceof HTMLElement ? target?.parentNode : null,
	);
	const isTargetInsideEditableArea = insideProseMirrorEditableArea(target);

	// Any click inside ProseMirror should be managed by ProseMirror
	if (isTargetInsideEditableArea) {
		return false;
	}
	const isEventComingFromContentArea = Boolean(
		event.currentTarget.querySelector('.ak-editor-content-area'),
	);

	// @see https://product-fabric.atlassian.net/browse/ED-4287
	// click event gets triggered twice on a checkbox (on <label> first and then on <input>)
	// by the time it gets triggered on input, PM already re-renders nodeView and detaches it from DOM
	// which doesn't pass the check !contentArea.contains(event.target)
	const isInputClicked = target?.nodeName === 'INPUT';
	// @see ED-5126
	const isPopupClicked = !!closestElement(target, '[data-editor-popup]');
	// Fixes issue when using a textarea for editor title in full page editor doesn't let user focus it.
	const isTextAreaClicked = target?.nodeName === 'TEXTAREA';
	const isBreadcrumbClicked = !!closestElement(target, 'nav[aria-label="Breadcrumbs"]');
	const selection = window.getSelection();
	const isEditorPopupTextSelected =
		selection?.type === 'Range' &&
		// Ignored via go/ees005
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		closestElement(selection?.anchorNode as HTMLElement, '[data-editor-popup]');

	// For clicks directly on the content component -- they should not be ignored
	const isContentComponent = target?.parentElement?.closest(`[${ignoreAttribute}]`);

	// This is a super workaround to find when events are coming from Confluence InlineComment modal
	// We don't own those components, so we can't change them
	const isEventComingFromInlineCommentPopup =
		Boolean(closestElement(event.currentTarget, 'div[offset]')) ||
		Boolean(closestElement(target, 'div[offset]'));

	const isAnchorButtonClicked =
		Boolean(closestElement(event.currentTarget, 'a')) ||
		Boolean(closestElement(target, 'a')) ||
		event.currentTarget?.nodeName === 'A' ||
		target?.nodeName === 'A';

	const isButtonClicked =
		Boolean(closestElement(event.currentTarget, 'button')) ||
		Boolean(closestElement(target, 'button')) ||
		event.currentTarget?.nodeName === 'BUTTON' ||
		target?.nodeName === 'BUTTON' ||
		(expValEquals('platform_editor_toolbar_migrate_loom', 'isEnabled', true) &&
			isAnchorButtonClicked);

	const isTargetInsideContentArea = Boolean(isTargetChildOfContentArea);

	const isBetweenContentAreaAndEditableContent =
		isTargetInsideContentArea && !isTargetInsideEditableArea;

	// Column Picker dropdown in Datasources table
	const isDatasourcePopupClicked = !!target?.closest('#column-picker-popup');

	const edgeCaseScenario1 =
		(isBetweenContentAreaAndEditableContent || !isEventComingFromContentArea) && !isEditorFocused;

	const edgeCaseScenario2 = !isTargetInsideContentArea && isEditorFocused;
	const edgeCaseScenario3 = isTargetContentArea && !isTargetInsideContentArea && !isEditorFocused;
	const edgeCaseScenario4 =
		isEventComingFromContentArea &&
		!isTargetContentArea &&
		!isTargetInsideContentArea &&
		!isEditorFocused;

	const edgeCases =
		edgeCaseScenario1 || edgeCaseScenario2 || edgeCaseScenario3 || edgeCaseScenario4;

	const isClickOutsideEditor =
		edgeCases &&
		!isDatasourcePopupClicked &&
		!isEventComingFromInlineCommentPopup &&
		!isButtonClicked &&
		!isInputClicked &&
		!isTextAreaClicked &&
		!isPopupClicked &&
		!isBreadcrumbClicked &&
		!isEditorPopupTextSelected &&
		!isContentComponent &&
		checkForModal(target);

	// click was within editor container and focus should be brought to input
	if (isClickOutsideEditor && view) {
		outsideProsemirrorEditorClickHandler(view, event);
	}
};

export const outsideProsemirrorEditorClickHandler = (
	view: EditorView,
	event: React.MouseEvent<HTMLElement, MouseEvent>,
): void => {
	const { dispatch, dom, state } = view;
	const { tr } = state;
	const isEditorFocused = !!view?.hasFocus?.();
	const isBottomAreaClicked = event.clientY > dom.getBoundingClientRect().bottom;

	if (isBottomAreaClicked) {
		tr.setMeta('outsideProsemirrorEditorClicked', true);
		addParagraphAtEnd(tr);
	}

	setSelectionTopLevelBlocks(
		tr,
		event,
		// Ignored via go/ees005
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		dom as HTMLElement,
		view.posAtCoords.bind(view),
		isEditorFocused,
	);

	tintDirtyTransaction(tr);

	if (!tr.docChanged && !tr.selectionSet) {
		return;
	}

	if (dispatch) {
		dispatch(tr);
	}

	view.focus();
	event.preventDefault();
};

export { clickAreaClickHandler };
