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
export function findLinksInNode(
  doc: Node,
  schema: Schema,
  node: Node,
  offset: number,
) {
  const links: Link[] = [];

  node.descendants((node, pos) => {
    const nodeContext = getLinkNodeContext(doc, pos);

    // Nodes
    if (isLinkNode(node)) {
      links.push({ type: 'node', pos: pos + offset, node, nodeContext });
    }

    // Marks
    if (node.marks) {
      for (let i = 0; i < node.marks.length; i++) {
        const mark = node.marks[i];

        if (isLinkMark(mark, schema)) {
          links.push({ type: 'mark', pos: pos + offset, mark, nodeContext });
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

export const getLinkNodeContext = (doc: Node, pos: number) => {
  const $pos = doc.resolve(pos);

  const maxDepth = 3;
  for (let i = 0; i <= maxDepth; i++) {
    const node = $pos.node($pos.depth - i);
    if (node && node.type.name !== 'paragraph') {
      return node.type.name;
    }
  }

  return 'unknown';
};

export const linkObjectFromNode = (
  doc: Node,
  schema: Schema,
  node: Node,
  pos: number,
): Link | undefined => {
  const nodeContext = getLinkNodeContext(doc, pos);

  if (isLinkNode(node)) {
    return { type: 'node', pos, node, nodeContext };
  }

  if (node.marks) {
    for (let i = 0; i < node.marks.length; i++) {
      const mark = node.marks[i];

      if (isLinkMark(mark, schema)) {
        return { type: 'mark', pos, mark, nodeContext };
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

    const link = linkObjectFromNode(tr.doc, schema, node, pos);

    if (!link) {
      continue;
    }

    links.push(link);
  }

  return links;
};

/**
 * Returns whether or not two sets of links appear to likely be the same set of links
 * That they are in the same order and that both their hrefs and appearances match
 */
export const areSameLinks = (linksA: Link[], linksB: Link[]) => {
  if (linksA.length !== linksB.length) {
    return false;
  }

  for (let i = 0; i < linksA.length; i++) {
    const linkA = linksA[i];
    const linkB = linksB[i];

    if (
      getLinkUrl(linkA) !== getLinkUrl(linkB) ||
      appearanceForLink(linkA) !== appearanceForLink(linkB)
    ) {
      return false;
    }
  }

  return true;
};
