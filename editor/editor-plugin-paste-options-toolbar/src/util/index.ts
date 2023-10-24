import type {
  Node as PMNode,
  Schema,
  Slice,
} from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

export function isPastedFromFabricEditor(pastedFrom: string): boolean {
  return pastedFrom === 'fabric-editor';
}

// @see https://product-fabric.atlassian.net/browse/ED-3159
// @see https://github.com/markdown-it/markdown-it/issues/38
export function escapeLinks(text: string) {
  return text.replace(
    /(\[([^\]]+)\]\()?((https?|ftp|jamfselfservice):\/\/[^\s"'>]+)/g,
    str => {
      return str.match(/^(https?|ftp|jamfselfservice):\/\/[^\s"'>]+$/)
        ? `<${str}>`
        : str;
    },
  );
}

export const hasMediaNode = (slice: Slice | undefined): boolean => {
  if (!slice) {
    return false;
  }

  let hasMedia = false;
  slice.content.descendants((node: PMNode) => {
    if (
      ['media', 'mediaInline', 'mediaGroup', 'mediaSingle'].includes(
        node.type.name,
      )
    ) {
      hasMedia = true;
      return false;
    }
    return true;
  });

  return hasMedia;
};

export const hasRuleNode = (slice: Slice, schema: Schema): boolean => {
  let hasRuleNode = false;
  slice.content.nodesBetween(0, slice.content.size, (node, start) => {
    if (node.type === schema.nodes.rule) {
      hasRuleNode = true;
    }
  });

  return hasRuleNode;
};

export const hasLinkMark = (
  state: EditorState,
  pasteStartPos: number,
  pasteEndPos: number,
): boolean => {
  return state.doc.rangeHasMark(
    pasteStartPos,
    pasteEndPos,
    state.schema.marks.link,
  );
};
