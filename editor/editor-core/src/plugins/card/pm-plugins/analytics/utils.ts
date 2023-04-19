import { Node, Schema } from 'prosemirror-model';
import { ReadonlyTransaction, Transaction } from 'prosemirror-state';

import { isLinkMark } from '@atlaskit/editor-common/utils';

import { appearanceForNodeType } from '../../utils';
import { Link } from './types';

/**
 * Whether a node is a "link" node, ie inline card, block card, embed card
 * (but not a text node with a link mark)
 */
export function isLinkNode(node: Node) {
  return !!appearanceForNodeType(node.type);
}

/**
 * Analytics appearance for link object
 */
export function appearanceForLink(link: Link) {
  if (link.type === 'node') {
    const appearance = appearanceForNodeType(link.node.type);
    if (appearance) {
      return appearance;
    }
  }

  return 'url';
}

const nodeHasLinkMark = (schema: Schema, node: Node) => {
  if (node.marks) {
    for (let i = 0; i < node.marks.length; i++) {
      const mark = node.marks[i];
      if (isLinkMark(mark, schema)) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Determine if a node is considered to be a link
 */
export const isLink = (schema: Schema, node: Node) => {
  if (isLinkNode(node)) {
    return true;
  }

  return nodeHasLinkMark(schema, node);
};

/**
 * Given a node, find all nodes and marks that are considered "links"
 * @param state EditorState
 * @param fragment Fragment to search
 * @returns Array of nodes and marks found in the fragment that are "links"
 */
export function findLinksInNode(schema: Schema, node: Node, offset: number) {
  const links: Link[] = [];

  node.descendants((node, pos) => {
    // Nodes
    if (isLinkNode(node)) {
      links.push({ type: 'node', pos: pos + offset, node });
    }

    // Marks
    if (node.marks) {
      for (let i = 0; i < node.marks.length; i++) {
        const mark = node.marks[i];

        if (isLinkMark(mark, schema)) {
          links.push({ type: 'mark', pos: pos + offset, mark });
        }
      }
    }
  });

  return links;
}

export function getLinkUrl(link: Link): string | undefined {
  if (link.type === 'node') {
    return link.node.attrs?.url;
  }
  return link.mark.attrs?.href;
}

export const linkObjectFromNode = (
  schema: Schema,
  node: Node,
  pos: number,
): Link | undefined => {
  if (isLinkNode(node)) {
    return { type: 'node', pos, node };
  }

  if (node.marks) {
    for (let i = 0; i < node.marks.length; i++) {
      const mark = node.marks[i];

      if (isLinkMark(mark, schema)) {
        return { type: 'mark', pos, mark };
      }
    }
  }
};

export const findLinksAtPositions = (
  tr: Transaction | ReadonlyTransaction,
  positions: number[],
) => {
  const schema = tr.doc.type.schema;
  const links: Link[] = [];

  for (let i = 0; i < positions.length; i++) {
    const pos = positions[i];
    const node = tr.doc.nodeAt(pos);

    if (!node) {
      continue;
    }

    const link = linkObjectFromNode(schema, node, pos);

    if (!link) {
      continue;
    }

    links.push(link);
  }

  return links;
};
