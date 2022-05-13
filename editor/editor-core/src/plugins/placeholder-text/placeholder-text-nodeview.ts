import { NodeView, EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import { Selection } from 'prosemirror-state';
import { getPosHandler } from '../../nodeviews';
import { browser, ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/utils';

type PmMutationRecord =
  | MutationRecord
  | {
      type: 'selection';
      target: Element;
    };

const serializePlaceholderNode = (node: PMNode): HTMLElement => {
  const element = document.createElement('span');

  element.classList.add('pm-placeholder');

  // the inline node api test suite requires the following class name
  element.classList.add('placeholderView-content-wrap');

  if (browser.gecko) {
    element.setAttribute('contenteditable', 'true');
  }

  element.innerText = ZERO_WIDTH_SPACE;

  const elementChildren = document.createElement('span');
  elementChildren.classList.add('pm-placeholder__text');
  elementChildren.dataset.placeholder = node.attrs.text;

  elementChildren.setAttribute('contenteditable', 'false');

  element.appendChild(elementChildren);
  if (browser.safari) {
    element.appendChild(document.createTextNode(ZERO_WIDTH_SPACE));
  } else {
    element.appendChild(document.createElement('wbr'));
  }

  return element;
};

export class PlaceholderTextNodeView implements NodeView {
  public readonly dom: Node;

  public constructor(
    private readonly node: PMNode,
    private readonly view: EditorView,
    private readonly getPos: getPosHandler,
  ) {
    this.dom = serializePlaceholderNode(this.node);
    this.getPos = getPos;
  }

  public stopEvent(e: Event) {
    if (e.type === 'mousedown' && typeof this.getPos === 'function') {
      e.preventDefault();

      const { view } = this;
      const startNodePosition = this.getPos();
      const tr = view.state.tr;

      tr.setSelection(Selection.near(tr.doc.resolve(startNodePosition)));

      view.dispatch(tr);

      return true;
    }

    return false;
  }

  public ignoreMutation(record: PmMutationRecord) {
    if (typeof this.getPos !== 'function' || record.type !== 'selection') {
      return true;
    }

    const { view, node } = this;
    const placeholderStartPosition = this.getPos();
    const placeholderEndPosition = this.getPos() + node.nodeSize;
    const selection = view.state.selection;

    // when the selection is set right after the placeholder.
    // we should let ProseMirror deal with this edge-case
    if (selection.from === placeholderEndPosition) {
      return false;
    }

    const isSelectionAtPlaceholder =
      selection.from === placeholderStartPosition;
    const isSelectionAfterlaceholder = selection.from > placeholderEndPosition;

    if (isSelectionAtPlaceholder || isSelectionAfterlaceholder) {
      const tr = view.state.tr;

      tr.setSelection(Selection.near(tr.doc.resolve(placeholderEndPosition)));

      view.dispatch(tr);
      return true;
    }

    return true;
  }
}
