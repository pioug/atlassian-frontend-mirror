import type { CellDomAttrs } from '@atlaskit/adf-schema';
import { getCellAttrs, getCellDomAttrs } from '@atlaskit/adf-schema';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';

import TableNodeView from './TableNodeViewBase';

const DEFAULT_COL_SPAN = 1;
const DEFAULT_ROW_SPAN = 1;

export default class TableCell
  extends TableNodeView<HTMLElement>
  implements NodeView
{
  constructor(
    node: PMNode,
    view: EditorView,
    getPos: () => number | undefined,
    eventDispatcher: EventDispatcher,
  ) {
    super(node, view, getPos, eventDispatcher);
  }

  update(node: PMNode) {
    const didUpdate = this.updateNodeView(node);
    if (didUpdate) {
      this.node = node;
    }
    return didUpdate;
  }

  private updateNodeView(node: PMNode) {
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
}
