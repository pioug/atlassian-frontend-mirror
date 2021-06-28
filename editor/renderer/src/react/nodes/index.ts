import React from 'react';
import { Fragment, Node, Mark } from 'prosemirror-model';

import Blockquote from './blockquote';
import BodiedExtension, {
  Props as BodiedExtensionProps,
} from './bodiedExtension';
import BulletList from './bulletList';
import DecisionList from './decisionList';
import Doc, { DocWithSelectAllTrap } from './doc';
import Extension, { Props as ExtensionProps } from './extension';
import HardBreak from './hardBreak';
import Heading from './heading';
import InlineExtension, {
  Props as InlineExtensionProps,
} from './inlineExtension';
import LayoutSection from './layoutSection';
import LayoutColumn from './layoutColumn';
import ListItem from './listItem';
import MediaSingle from './mediaSingle';
import Caption from './caption';
import OrderedList from './orderedList';
import Panel from './panel';
import Paragraph from './paragraph';
import Placeholder from './placeholder';
import Rule from './rule';
import TaskList from './taskList';
import Table from './table';
import { TableCell, TableHeader } from './tableCell';
import TableRow from './tableRow';
import UnknownBlock from './unknownBlock';
import Loadable from 'react-loadable';
import EmbedCard from './embedCard';
import { UnsupportedBlock, UnsupportedInline } from '@atlaskit/editor-common';

import type CodeBlockComponent from './codeBlock';
import type TaskItemComponent from './taskItem';
import type DecisionItemComponent from './decisionItem';
import type DateComponent from './date';
import type StatusComponent from './status';
import type EmojiComponent from './emoji';
import type InlineCardComponent from './inlineCard';
import type BlockCardComponent from './blockCard';
import type MediaComponent from './media';
import type MediaGroupComponent from './mediaGroup';
import type MentionComponent from './mention';
import type ExpandComponent from '../../ui/Expand';

const CodeBlock = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_renderer-node_CodeBlock" */
      './codeBlock'
    ).then((mod) => mod.default) as Promise<typeof CodeBlockComponent>,
  loading: () => null,
});

const TaskItem = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_renderer-node_TaskItem" */
      './taskItem'
    ).then((mod) => mod.default) as Promise<typeof TaskItemComponent>,
  loading: () => null,
});

const DecisionItem = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_renderer-node_DecisionItem" */
      './decisionItem'
    ).then((mod) => mod.default) as Promise<typeof DecisionItemComponent>,
  loading: () => null,
});

const Date = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_renderer-node_Date" */
      './date'
    ).then((mod) => mod.default) as Promise<typeof DateComponent>,
  loading: () => null,
});

const Status = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_renderer-node_Status" */
      './status'
    ).then((mod) => mod.default) as Promise<typeof StatusComponent>,
  loading: () => null,
});

const Emoji = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_renderer-node_Emoji" */
      './emoji'
    ).then((mod) => mod.default) as Promise<typeof EmojiComponent>,
  loading: () => null,
});

const InlineCard = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_renderer-node_InlineCard" */
      './inlineCard'
    ).then((mod) => mod.default) as Promise<typeof InlineCardComponent>,
  loading: () => null,
});

const BlockCard = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_renderer-node_BlockCard" */
      './blockCard'
    ).then((mod) => mod.default) as Promise<typeof BlockCardComponent>,
  loading: () => null,
});

const Media = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_renderer-node_Media" */
      './media'
    ).then((mod) => mod.default) as Promise<typeof MediaComponent>,
  loading: () => null,
});

const MediaGroup = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_renderer-node_MediaGroup" */
      './mediaGroup'
    ).then((mod) => mod.default) as Promise<typeof MediaGroupComponent>,
  loading: () => null,
});

const Mention = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_renderer-node_Mention" */
      './mention'
    ).then((mod) => mod.default) as Promise<typeof MentionComponent>,
  loading: () => null,
});

const Expand = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_renderer-node_Expand" */
      '../../ui/Expand'
    ).then((mod) => mod.default) as Promise<typeof ExpandComponent>,
  loading: () => null,
});

export const nodeToReact: { [key: string]: React.ComponentType<any> } = {
  blockquote: Blockquote,
  bulletList: BulletList,
  blockCard: BlockCard,
  caption: Caption,
  codeBlock: CodeBlock,
  date: Date,
  decisionItem: DecisionItem,
  decisionList: DecisionList,
  doc: Doc,
  emoji: Emoji,
  extension: Extension,
  bodiedExtension: BodiedExtension,
  hardBreak: HardBreak,
  heading: Heading,
  inlineCard: InlineCard,
  inlineExtension: InlineExtension,
  layoutSection: LayoutSection,
  layoutColumn: LayoutColumn,
  listItem: ListItem,
  media: Media,
  mediaGroup: MediaGroup,
  mediaSingle: MediaSingle,
  mention: Mention,
  orderedList: OrderedList,
  panel: Panel,
  paragraph: Paragraph,
  placeholder: Placeholder,
  rule: Rule,
  status: Status,
  taskItem: TaskItem,
  taskList: TaskList,
  table: Table,
  tableCell: TableCell,
  tableHeader: TableHeader,
  tableRow: TableRow,
  unknownBlock: UnknownBlock,
  unsupportedBlock: UnsupportedBlock,
  unsupportedInline: UnsupportedInline,
  expand: Expand,
  nestedExpand: Expand,
  embedCard: EmbedCard,
};

export interface ToReactFlags {
  allowSelectAllTrap?: boolean;
}

export const toReact = (
  node: Node,
  flags?: ToReactFlags,
): React.ComponentType<any> => {
  if (node.type.name === 'doc' && flags?.allowSelectAllTrap === true) {
    return DocWithSelectAllTrap;
  }

  return nodeToReact[node.type.name];
};

export interface TextWrapper {
  type: {
    name: 'textWrapper';
  };
  content: Node[];
  nodeSize: number;
}

export interface NodeSimple {
  type: {
    name: string;
  };
  attrs?: any;
  text?: string;
  nodeSize: number;
}

/*
 *  Wraps adjacent textnodes in a textWrapper
 *
 *  Input:
 *  [
 *    {
 *      type: 'text',
 *      text: 'Hello'
 *    },
 *    {
 *      type: 'text',
 *      text: 'World!',
 *      marks: [
 *        {
 *          type: 'strong'
 *        }
 *      ]
 *    }
 *  ]
 *
 *  Output:
 *  [
 *    {
 *      type: 'textWrapper',
 *      content: [
 *        {
 *          type: 'text',
 *          text: 'Hello'
 *        },
 *        {
 *          type: 'text',
 *          text: 'World!',
 *          marks: [
 *            {
 *              type: 'strong'
 *            }
 *          ]
 *        }
 *      ]
 *    }
 *  ]
 */
export const mergeTextNodes = (nodes: (Node | NodeSimple)[]) => {
  return nodes.reduce<(TextWrapper | Node | NodeSimple)[]>((acc, current) => {
    if (!isText(current.type.name)) {
      acc.push(current);
      return acc;
    }

    // Append node to previous node, if it was a text wrapper
    if (acc.length > 0 && isTextWrapper(acc[acc.length - 1])) {
      const textWrapper = acc[acc.length - 1] as TextWrapper;
      textWrapper.content!.push(current as Node);
      textWrapper.nodeSize += current.nodeSize;
    } else {
      acc.push({
        type: {
          name: 'textWrapper',
        },
        content: [current],
        nodeSize: current.nodeSize,
      } as TextWrapper);
    }

    return acc;
  }, []);
};

export const isText = (type: string): type is 'text' => {
  return type === 'text';
};

export const isTextWrapper = (
  node: Node | TextWrapper | NodeSimple,
): node is TextWrapper => {
  return node.type.name === 'textWrapper';
};

export function isTextNode(node: Node | Mark): node is Node {
  return node.type.name === 'text';
}

const whitespaceRegex = /^\s*$/;

/**
 * Detects whether a fragment contains a single paragraph node
 * whose content satisfies the condition for an emoji block
 */
export const isEmojiDoc = (doc: Fragment): boolean => {
  if (doc.childCount !== 1) {
    return false;
  }
  const parentNodes: Node[] = [];
  doc.forEach((child) => parentNodes.push(child));
  const node = parentNodes[0];
  return node.type.name === 'paragraph' && isEmojiBlock(node.content);
};

const isEmojiBlock = (pnode: Fragment): boolean => {
  const content: Node[] = [];
  // Optimisation for long documents - worst case block will be space-emoji-space
  if (pnode.childCount > 7) {
    return false;
  }
  pnode.forEach((child) => content.push(child));
  let emojiCount = 0;
  for (let i = 0; i < content.length; ++i) {
    const node = content[i];
    switch (node.type.name) {
      case 'text':
        if (node.text && !node.text.match(whitespaceRegex)) {
          return false;
        }
        continue;
      case 'emoji':
        if (++emojiCount > 3) {
          return false;
        }
        continue;
      default:
        // Only text and emoji nodes are allowed
        return false;
    }
  }
  return emojiCount > 0;
};

export {
  Blockquote,
  BodiedExtension,
  BulletList,
  BlockCard,
  Caption,
  CodeBlock,
  Date,
  DecisionItem,
  DecisionList,
  Doc,
  DocWithSelectAllTrap,
  Emoji,
  Extension,
  Expand,
  HardBreak,
  Heading,
  ListItem,
  InlineCard,
  InlineExtension,
  LayoutSection,
  LayoutColumn,
  Media,
  MediaGroup,
  MediaSingle,
  Mention,
  OrderedList,
  Panel,
  Paragraph,
  Placeholder,
  Rule,
  Status,
  TaskItem,
  TaskList,
  Table,
  TableCell,
  TableRow,
  UnknownBlock,
  EmbedCard,
};
export type { BodiedExtensionProps, ExtensionProps, InlineExtensionProps };
