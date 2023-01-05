import uuid from 'uuid';
import { Node, DOMSerializer } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { getPosHandler } from '@atlaskit/editor-common/types';

import {
  getCellDomAttrs,
  getCellAttrs,
  CellDomAttrs,
} from '@atlaskit/adf-schema';
import type { GetEditorFeatureFlags } from '@atlaskit/editor-common/types';

const DEFAULT_COL_SPAN = 1;
const DEFAULT_ROW_SPAN = 1;

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
    getEditorFeatureFlags: GetEditorFeatureFlags,
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

    const { mouseMoveOptimization } = getEditorFeatureFlags();

    if (mouseMoveOptimization && observer) {
      this.contentDOM.id = uuid();
      this.mouseMoveOptimization = mouseMoveOptimization;
      this.observer = observer;
      observer.observe(this.contentDOM);
    }
  }

  private updateNodeView(node: Node) {
    if (this.node.type !== node.type) {
      return false;
    }

    const attrs = getCellDomAttrs(this.node);
    const nextAttrs = getCellDomAttrs(node);

    const { colspan, rowspan } = getCellAttrs(this.dom);

    // need to rerender when colspan/rowspan in dom are different from the node attrs
    // this can happen when undoing merge cells
    if (
      colspan !== (node.attrs.colspan || DEFAULT_COL_SPAN) ||
      rowspan !== (node.attrs.rowspan || DEFAULT_ROW_SPAN)
    ) {
      return false;
    }

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
    const didUpdate = this.updateNodeView(node);
    if (didUpdate) {
      this.node = node;
    }
    return didUpdate;
  }

  destroy() {
    if (this.mouseMoveOptimization && this.observer) {
      this.observer.unobserve(this.contentDOM);
    }
  }
}
