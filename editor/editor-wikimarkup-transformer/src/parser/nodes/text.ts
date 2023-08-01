import {
  Mark as PMMark,
  Node as PMNode,
  Schema,
} from '@atlaskit/editor-prosemirror/model';

export function createTextNode(
  input: string,
  schema: Schema,
  marks?: PMMark[],
): PMNode[] {
  if (input === '') {
    return [];
  }
  const node = schema.text(input, marks || []);
  return [node];
}
