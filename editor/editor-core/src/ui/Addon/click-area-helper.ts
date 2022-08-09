import { EditorView } from 'prosemirror-view';
import { closestElement } from '../../utils/dom';
import {
  setSelectionTopLevelBlocks,
  hasGapCursorPlugin,
} from '../../plugins/selection/gap-cursor-selection';
import { addParagraphAtEnd } from '../../commands';

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
  view: EditorView<any>,
  event: React.MouseEvent<any>,
) => {
  const isTargetContentArea = event.currentTarget.querySelector(
    '.ak-editor-content-area',
  );
  const isEditorFocused = !!view?.hasFocus?.();
  const target = event.target as HTMLElement;

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
  const isTargetChildOfContentArea = insideContentArea(
    target.parentNode as HTMLElement | null,
  );
  const selection = window.getSelection();
  const isEditorPopupTextSelected =
    selection?.type === 'Range' &&
    closestElement(selection?.anchorNode as HTMLElement, '[data-editor-popup]');

  const isClickOutsideEditor =
    (!isTargetContentArea || !isTargetChildOfContentArea || !isEditorFocused) &&
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
  view: EditorView<any>,
  event: React.MouseEvent<any, MouseEvent>,
) => {
  const { dispatch, dom, state } = view;
  const { tr } = state;
  const isEditorFocused = !!view?.hasFocus?.();
  const isBottomAreaClicked =
    event.clientY > dom.getBoundingClientRect().bottom;

  if (isBottomAreaClicked) {
    addParagraphAtEnd(tr);
  }

  if (hasGapCursorPlugin(state)) {
    setSelectionTopLevelBlocks(
      tr,
      event,
      dom as HTMLElement,
      view.posAtCoords.bind(view),
      isEditorFocused,
    );
  }

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
