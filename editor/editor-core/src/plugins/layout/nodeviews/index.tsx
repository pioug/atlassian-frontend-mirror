import { EditorView, NodeView } from 'prosemirror-view';
import {
  Node as PmNode,
  DOMSerializer,
  DOMOutputSpec,
} from 'prosemirror-model';

import { getPosHandlerNode, getPosHandler } from '../../../nodeviews/';
import { selectNode } from '../../../utils/commands';
import { createSelectionAwareClickHandler } from '../../../nodeviews/utils';

const toDOM = (): DOMOutputSpec => [
  'div',
  { 'data-layout-section': 'true' },
  0,
];

export class LayoutSectionNodeView implements NodeView {
  node: PmNode;
  view: EditorView;
  dom?: HTMLElement;
  contentDOM?: HTMLElement;
  getPos: getPosHandlerNode;
  pos: number;
  clickHandler?: (event: Event) => false | void;
  clickCleanup?: () => void;

  constructor(node: PmNode, view: EditorView, getPos: getPosHandlerNode) {
    const { dom, contentDOM } = DOMSerializer.renderSpec(document, toDOM());
    this.getPos = getPos;
    this.pos = getPos();
    this.view = view;
    this.node = node;
    this.dom = dom as HTMLElement;
    this.contentDOM = contentDOM as HTMLElement;
    this.initHandlers();
  }

  private initHandlers() {
    if (this.dom) {
      const { handler, cleanup } = createSelectionAwareClickHandler(
        this.dom,
        this.handleClick,
      );
      this.clickHandler = handler;
      this.clickCleanup = cleanup;
      this.dom.addEventListener('click', handler);
    }
  }

  private handleClick = (event: Event) => {
    const target = event.target as HTMLElement;
    // only set node selection if click was on layout boundary
    if (
      target.hasAttribute('data-layout-section') ||
      target.hasAttribute('data-layout-column')
    ) {
      event.preventDefault();
      const { state, dispatch } = this.view;
      selectNode(this.getPos())(state, dispatch);
    }
  };

  destroy() {
    if (this.dom) {
      this.clickHandler &&
        this.dom.removeEventListener('click', this.clickHandler);
      this.clickCleanup && this.clickCleanup();
    }

    this.dom = undefined;
    this.contentDOM = undefined;
  }
}

export default function layoutSectionNodeView() {
  return (node: PmNode, view: EditorView, getPos: getPosHandler): NodeView =>
    new LayoutSectionNodeView(node, view, getPos as getPosHandlerNode);
}
