import { closestElement } from '@atlaskit/editor-common/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { checkForModal } from './checkForModal';
import { ignoreAttribute } from './ClickAreaBlock/contentComponentWrapper';
import { outsideProsemirrorEditorClickHandler } from './outsideProsemirrorEditorClickHandler';

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

const clickAreaClickHandler = (
	view: EditorView,
	event: React.MouseEvent<HTMLElement>,
): boolean | void => {
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
		isAnchorButtonClicked;

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

export { clickAreaClickHandler };
