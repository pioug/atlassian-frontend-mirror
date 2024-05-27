import { type Node as PMNode, type Schema } from '@atlaskit/editor-prosemirror/model';
/**
 * This will return ADF to replace the titles in some macro
 * For example
 * {panel:title}aaa{panel}
 */
export function title(text: string, schema: Schema): PMNode {
  const mark = schema.marks.strong.create();
  const title = schema.text(text, [mark]);
  return schema.nodes.paragraph.createChecked({}, [title]);
}
