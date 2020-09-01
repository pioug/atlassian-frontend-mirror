import { Node as PMNode } from 'prosemirror-model';
export function useNodeData(node?: PMNode) {
  let text = 'Unsupported content';
  if (node) {
    const { originalValue } = node.attrs;
    if (
      originalValue.text ||
      (originalValue.attrs && originalValue.attrs.text)
    ) {
      text = originalValue.text ? originalValue.text : originalValue.attrs.text;
    } else if (originalValue.type) {
      text = `Unsupported ${originalValue.type}`;
    }
  }
  return text;
}
