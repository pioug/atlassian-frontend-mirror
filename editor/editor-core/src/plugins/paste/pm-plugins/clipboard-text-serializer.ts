import type { Slice, Node } from '@atlaskit/editor-prosemirror/model';

/**
 * Returns a plain text serialization of a given slice. This is used for populating the plain text
 * section of the clipboard on copy.
 * The current implementation is bare bones - only inlineCards, blockCards and mentions are tested (they
 * previously were empty on plain text copy).
 * Unknown nodes are passed to node.textBetween().
 *
 * By default (without this function passed to the editor), the editor uses
 * `slice.content.textBetween(0, slice.content.size, "\n\n")`
 * (see https://prosemirror.net/docs/ref/#view.EditorProps.clipboardTextSerializer)
 */
export function clipboardTextSerializer(slice: Slice) {
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
