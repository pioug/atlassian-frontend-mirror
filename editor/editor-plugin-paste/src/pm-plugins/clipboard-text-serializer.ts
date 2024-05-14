import type { Node, Slice } from '@atlaskit/editor-prosemirror/model';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

/**
 * Returns a plain text serialization of a given slice. This is used for populating the plain text
 * section of the clipboard on copy.
 * The current implementation is bare bones - only inlineCards, blockCards and mentions are tested (they
 * previously were empty on plain text copy).
 *
 * By default (without this function passed to the editor), the editor uses
 * `slice.content.textBetween(0, slice.content.size, "\n\n")`
 * (see https://prosemirror.net/docs/ref/#view.EditorProps.clipboardTextSerializer)
 */
export function clipboardTextSerializer(slice: Slice) {
  if (
    // Enables bugfix - https://product-fabric.atlassian.net/browse/ED-23043
    getBooleanFF(
      'platform.editor.preserve-whitespace-clipboard-text-serialization',
    )
  ) {
    return clipboardTextSerializerSimplified(slice);
  } else {
    return clipboardTextSerializerLegacy(slice);
  }
}

export function clipboardTextSerializerSimplified(slice: Slice) {
  const blockSeparator = '\n\n';

  return slice.content.textBetween(
    0,
    slice.content.size,
    blockSeparator,
    leafNode => {
      switch (leafNode.type.name) {
        case 'hardBreak':
          return '\n';
        case 'text':
          return leafNode.text;
        case 'inlineCard':
          return leafNode.attrs.url;
        case 'blockCard':
          return leafNode.attrs.url;
        // Note: Due to relying on an async fetch of the Mention name by the Node's React component,
        // pasting a mention does not actually work for the in-product Mention implementation.
        // However, this is also true of the previous implementation.
        // Bug ticket: https://product-fabric.atlassian.net/browse/ED-23076
        case 'mention':
          return leafNode.attrs.text;
        default:
          // Unsupported node
          return leafNode.text ?? '';
      }
    },
  );
}

function clipboardTextSerializerLegacy(slice: Slice) {
  let text = '';
  const blockSeparater = '\n\n';
  slice.content.nodesBetween(0, slice.content.size, (node: Node) => {
    if (node.type.isBlock) {
      text += blockSeparater;
    }
    if (node.type.name === 'paragraph') {
      return true;
    } else if (node.type.name === 'hardBreak') {
      text += '\n';
    } else if (node.type.name === 'text') {
      text += node.text;
    } else if (node.type.name === 'inlineCard') {
      text += node.attrs.url;
    } else if (node.type.name === 'blockCard') {
      text += node.attrs.url;
    } else if (node.type.name === 'mention') {
      text += node.attrs.text;
    } else {
      text += node.textBetween(0, node.content.size, '\n\n');
    }
    return false;
  });
  return text.trim();
}
