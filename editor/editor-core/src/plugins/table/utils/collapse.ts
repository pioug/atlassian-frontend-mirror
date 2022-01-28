import { NodeType, NodeRange, Schema } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { findWrapping } from 'prosemirror-transform';

import { findTable } from '@atlaskit/editor-tables/utils';

interface IsTableCollapsibleResult<S extends Schema = any> {
  tableIsCollapsible: boolean;
  range?: NodeRange;
  findWrappingRes?:
    | Array<{ type: NodeType<S>; attrs?: { [key: string]: any } | null }>
    | null
    | undefined;
}

const bail = () => ({
  tableIsCollapsible: false,
});

/**
 * Checks whether we can wrap the selected table into an expand via
 * prosemirror-transform's `findWrapping` helper
 */
export const isTableCollapsible = (
  tr: Transaction,
): IsTableCollapsibleResult => {
  const selection = tr.selection;
  const schema = tr.doc.type.schema;
  const nodePos = findTable(selection);

  if (!nodePos) {
    return bail();
  }

  const expand = schema.nodes.expand as NodeType;
  const { node, pos } = nodePos;
  const $pos = tr.doc.resolve(pos);
  const range = new NodeRange(
    $pos,
    tr.doc.resolve(pos + node.nodeSize),
    $pos.depth,
  );

  if (!range) {
    return bail();
  }

  const canWrap = findWrapping(range, expand);
  if (canWrap === null) {
    return bail();
  }

  return {
    tableIsCollapsible: true,
    range,
    /**
     * Do we ever want to deal with the result of `findWrapping`? Probably not,
     * but we have it anyway.
     */
    findWrappingRes: canWrap,
  };
};

/**
 * Collapses the selected table into an expand given a transaction via
 * `Transform.wrap`.
 *
 * Will return undefined if it cannot determine the relevant table from a
 * selection, or if the table itself isn't collapsible.
 *
 * @param tr
 * @returns Transaction | undefined
 */
export const collapseSelectedTable = (
  tr: Transaction,
): Transaction | undefined => {
  const canCollapse = isTableCollapsible(tr);
  const expand = tr.doc.type.schema.nodes.expand as NodeType;

  if (!canCollapse.range || !canCollapse.tableIsCollapsible) {
    return undefined;
  }

  /**
   * TODO: add attrs: { __expanded: false } when
   * - it is working with new collab (CEMS-1204)
   * - synchrony is no longer used
   *
   *   (via confluence-frontend, "this feature" referencing allowInteractiveExpand)
   *   `we can NEVER allow this feature to be enabled for the synchrony-powered editor
   */
  tr.wrap(canCollapse.range, [
    {
      type: expand,
    },
  ]).setMeta('scrollIntoView', true);

  return tr;
};
