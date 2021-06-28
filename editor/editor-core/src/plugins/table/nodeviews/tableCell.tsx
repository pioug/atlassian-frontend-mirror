import uuid from 'uuid';
import { Node, DOMSerializer } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import { ProviderFactory } from '@atlaskit/editor-common';
import { getPosHandler } from '../../../../src/nodeviews';
import { setCellAttrs, CellDomAttrs } from '@atlaskit/adf-schema';
import { getFeatureFlags } from '../../feature-flags-context';

export default class TableCellNodeView implements NodeView {
  node: Node;
  dom: HTMLElement;
  contentDOM: HTMLElement;
  getPos: getPosHandler;
  view: EditorView;
  providerFactory?: ProviderFactory;
  observer?: ResizeObserver;
  mouseMoveOptimization?: boolean;

  constructor(
    node: Node,
    view: EditorView,
    getPos: any,
    observer?: ResizeObserver,
  ) {
    this.view = view;
    this.node = node;

    const { dom, contentDOM } = DOMSerializer.renderSpec(
      document,
      node.type.spec.toDOM!(node),
    );

    this.getPos = getPos;
    this.dom = dom as HTMLElement;
    this.contentDOM = contentDOM as HTMLElement;

    const { mouseMoveOptimization } = getFeatureFlags(view.state) || {};

    if (mouseMoveOptimization && observer) {
      this.contentDOM.id = uuid();
      this.mouseMoveOptimization = mouseMoveOptimization;
      this.observer = observer;
      observer.observe(this.contentDOM);
    }
  }

  shouldRecreateNodeView(node: Node): boolean {
    if (this.node.type !== node.type) {
      return false;
    }

    const attrs = setCellAttrs(this.node);
    const nextAttrs = setCellAttrs(node);

    // added + changed attributes
    const addedAttrs = Object.entries(nextAttrs).filter(
      ([key, value]) => attrs[key as keyof CellDomAttrs] !== value,
    );

    const removedAttrs = Object.keys(attrs).filter(
      (key) => !nextAttrs.hasOwnProperty(key),
    );

    if (addedAttrs.length || removedAttrs.length) {
      addedAttrs.forEach(([key, value]) =>
        this.dom.setAttribute(key, value || ''),
      );
      removedAttrs.forEach((key) => this.dom.removeAttribute(key));
      return true;
    }

    // Return true to not re-render this node view
    if (this.node.sameMarkup(node)) {
      return true;
    }

    return false;
  }

  update(node: Node) {
    const shouldUpdate = this.shouldRecreateNodeView(node);
    this.node = node;
    return shouldUpdate;
  }

  destroy() {
    if (this.mouseMoveOptimization && this.observer) {
      this.observer.unobserve(this.contentDOM);
    }
  }
}
