import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { closestElement } from '@atlaskit/editor-common/utils';
import { setSelectionTopLevelBlocks } from '@atlaskit/editor-common/selection';
import { addParagraphAtEnd } from '@atlaskit/editor-common/commands';

// we ignore all of the clicks made inside <div class="ak-editor-content-area" /> (but not clicks on the node itself)
const insideContentArea = (ref: HTMLElement | null): boolean => {
  while (ref) {
    if (ref.classList && ref.classList.contains('ak-editor-content-area')) {
      return true;
    }
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
export const checkForModal = (target: HTMLElement) => {
  const modalDialog = target.closest('[role=dialog]');

  if (modalDialog) {
    // return false if not an editor inside modal, otherwise return true
    return !!modalDialog?.querySelector('.akEditor');
  }

  // no modal present so we can return true
  return true;
};

const clickAreaClickHandler = (
  view: EditorView,
  event: React.MouseEvent<any>,
) => {
  const isEditorFocused = !!view?.hasFocus?.();

  const target = event.target as HTMLElement;
  const isTargetContentArea = target.classList.contains(
    'ak-editor-content-area',
  );
  const isTargetChildOfContentArea = insideContentArea(
    target.parentNode as HTMLElement | null,
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
  const isInputClicked = target.nodeName === 'INPUT';
  // @see ED-5126
  const isPopupClicked = !!closestElement(target, '[data-editor-popup]');
  // Fixes issue when using a textarea for editor title in full page editor doesn't let user focus it.
  const isTextAreaClicked = target.nodeName === 'TEXTAREA';
  const isBreadcrumbClicked = !!closestElement(
    target,
    'nav[aria-label="Breadcrumbs"]',
  );
  const selection = window.getSelection();
  const isEditorPopupTextSelected =
    selection?.type === 'Range' &&
    closestElement(selection?.anchorNode as HTMLElement, '[data-editor-popup]');

  // This is a super workaround to find when events are coming from Confluence InlineComment modal
  // We don't own those components, so we can't change them
  const isEventComingFromInlineCommentPopup =
    Boolean(closestElement(event.currentTarget, 'div[offset]')) ||
    Boolean(closestElement(target, 'div[offset]'));

  const isButtonClicked =
    Boolean(closestElement(event.currentTarget, 'button')) ||
    Boolean(closestElement(target, 'button')) ||
    event.currentTarget?.nodeName === 'BUTTON' ||
    target.nodeName === 'BUTTON';

  const isTargetInsideContentArea = Boolean(isTargetChildOfContentArea);

  const isBetweenContentAreaAndEditableContent =
    isTargetInsideContentArea && !isTargetInsideEditableArea;

  // Column Picker dropdown in Datasources table
  const isDatasourcePopupClicked = !!target?.closest('#column-picker-popup');

  const edgeCaseScenario1 =
    (isBetweenContentAreaAndEditableContent || !isEventComingFromContentArea) &&
    !isEditorFocused;

  const edgeCaseScenario2 = !isTargetInsideContentArea && isEditorFocused;
  const edgeCaseScenario3 =
    isTargetContentArea && !isTargetInsideContentArea && !isEditorFocused;
  const edgeCaseScenario4 =
    isEventComingFromContentArea &&
    !isTargetContentArea &&
    !isTargetInsideContentArea &&
    !isEditorFocused;

  const edgeCases =
    edgeCaseScenario1 ||
    edgeCaseScenario2 ||
    edgeCaseScenario3 ||
    edgeCaseScenario4;

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
    checkForModal(target);

  // click was within editor container and focus should be brought to input
  if (isClickOutsideEditor && view) {
    outsideProsemirrorEditorClickHandler(view, event);
  }
};

const outsideProsemirrorEditorClickHandler = (
  view: EditorView,
  event: React.MouseEvent<any, MouseEvent>,
) => {
  const { dispatch, dom, state } = view;
  const { tr } = state;
  const isEditorFocused = !!view?.hasFocus?.();
  const isBottomAreaClicked =
    event.clientY > dom.getBoundingClientRect().bottom;

  if (isBottomAreaClicked) {
    tr.setMeta('outsideProsemirrorEditorClicked', true);
    addParagraphAtEnd(tr);
  }

  setSelectionTopLevelBlocks(
    tr,
    event,
    dom as HTMLElement,
    view.posAtCoords.bind(view),
    isEditorFocused,
  );

  if (!tr.docChanged && !tr.selectionSet) {
    return;
  }

  if (dispatch) {
    dispatch(tr);
  }

  view.focus();
  event.stopPropagation();
  event.preventDefault();
};

export { clickAreaClickHandler };
