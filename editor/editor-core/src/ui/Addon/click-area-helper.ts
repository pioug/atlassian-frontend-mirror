import { EditorView } from 'prosemirror-view';
import { Transaction } from 'prosemirror-state';
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

const clickAreaClickHandler = (
  view: EditorView<any>,
  event: React.MouseEvent<any>,
) => {
  const contentArea = event.currentTarget.querySelector(
    '.ak-editor-content-area',
  );
  const editorFocused = !!(view && view.hasFocus());
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
  const targetIsNotContentArea = !contentArea;
  const tragetIsNotChildOfContentArea = !insideContentArea(
    target.parentNode as HTMLElement | null,
  );
  const editorIsNotInFocus = editorFocused === false;
  const selection = window.getSelection();
  const isEditorPopupTextSelected =
    selection?.type === 'Range' &&
    closestElement(selection?.anchorNode as HTMLElement, '[data-editor-popup]');
  const isModalDialog = !!target.closest('[role=dialog]');

  const isClickOutsideEditor =
    (targetIsNotContentArea ||
      tragetIsNotChildOfContentArea ||
      editorIsNotInFocus) &&
    !isInputClicked &&
    !isTextAreaClicked &&
    !isPopupClicked &&
    !isModalDialog &&
    !isBreadcrumbClicked &&
    !isPopupClicked &&
    !isEditorPopupTextSelected;

  if (isClickOutsideEditor && view) {
    outsideProsemirrorEditorClickHandler(view, event);
  }
};

const outsideProsemirrorEditorClickHandler = (
  view: EditorView<any>,
  event: React.MouseEvent<any, MouseEvent>,
) => {
  const { dispatch, dom, state } = view;
  const editorFocused = !!(view && view.hasFocus());
  const { tr } = state;

  appendEmptyParagraph(event, dom, tr);
  if (hasGapCursorPlugin(state)) {
    setSelectionTopLevelBlocks(
      tr,
      event,
      dom as HTMLElement,
      view.posAtCoords.bind(view),
      editorFocused,
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

const appendEmptyParagraph = (
  event: React.MouseEvent<any, MouseEvent>,
  dom: Element,
  tr: Transaction,
) => {
  const bottomAreaClicked = event.clientY > dom.getBoundingClientRect().bottom;
  if (bottomAreaClicked) {
    addParagraphAtEnd(tr);
  }
};

export { clickAreaClickHandler };
