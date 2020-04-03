import { Transaction } from 'prosemirror-state';
import { filterChildrenBetween } from '../../../utils';
import { Node, Schema } from 'prosemirror-model';

const SMART_TO_ASCII = {
  '…': '...',
  '→': '->',
  '←': '<-',
  '–': '--',
  '“': '"',
  '”': '"',
  '‘': "'",
  '’': "'",
};

const FIND_SMART_CHAR = new RegExp(
  `[${Object.keys(SMART_TO_ASCII).join('')}]`,
  'g',
);

const replaceMentionOrEmojiForTextContent = (
  position: number,
  nodeSize: number,
  textContent: string,
  tr: Transaction,
): void => {
  const currentPos = tr.mapping.map(position);
  const { schema } = tr.doc.type;

  tr.replaceWith(currentPos, currentPos + nodeSize, schema.text(textContent));
};

const replaceSmartCharsToAscii = (
  position: number,
  textContent: string,
  tr: Transaction,
): void => {
  const textExtracted = textContent.substr(position - 1);
  const { schema } = tr.doc.type;
  let match: RegExpExecArray | null;

  while ((match = FIND_SMART_CHAR.exec(textExtracted))) {
    const { 0: smartChar, index: offset } = match;
    const replacePos = tr.mapping.map(position + offset);
    const replacementText = schema.text(
      SMART_TO_ASCII[smartChar as keyof typeof SMART_TO_ASCII],
    );
    tr.replaceWith(replacePos, replacePos + smartChar.length, replacementText);
  }
};

const isNodeTextBlock = (schema: Schema) => {
  const { mention, text, emoji } = schema.nodes;

  return (node: Node, _: any, parent: Node) => {
    if (node.type === mention || node.type === emoji || node.type === text) {
      return parent.isTextblock;
    }
    return;
  };
};

export const transformSmartCharsMentionsAndEmojis = (
  from: number,
  to: number,
  tr: Transaction,
): void => {
  const { schema } = tr.doc.type;
  const { mention, text, emoji } = schema.nodes;
  // Traverse through all the nodes within the range and replace them with their plaintext counterpart
  const children = filterChildrenBetween(
    tr.doc,
    from,
    to,
    isNodeTextBlock(schema),
  );

  children.forEach(({ node, pos }) => {
    if (node.type === mention || node.type === emoji) {
      replaceMentionOrEmojiForTextContent(
        pos,
        node.nodeSize,
        node.attrs.text,
        tr,
      );
    } else if (node.type === text && node.text) {
      const replacePosition = pos > from ? pos : from;

      replaceSmartCharsToAscii(replacePosition, node.text, tr);
    }
  });
};
