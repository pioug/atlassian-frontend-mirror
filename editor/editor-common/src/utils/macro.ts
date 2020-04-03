import { Node as PmNode } from 'prosemirror-model';

export interface Params {
  node: PmNode;
  type: 'image' | 'icon';
}

export const getExtensionLozengeData = ({
  node,
  type,
}: Params): { url: string; width?: number; height?: number } | undefined => {
  if (!node.attrs.parameters) {
    return;
  }
  const { macroMetadata } = node.attrs.parameters;
  if (macroMetadata && macroMetadata.placeholder) {
    let placeholderData;
    macroMetadata.placeholder.forEach(
      (placeholder: { type: Params['type']; data: any }) => {
        if (
          placeholder.type === type &&
          placeholder.data &&
          placeholder.data.url
        ) {
          placeholderData = placeholder.data;
        }
      },
    );

    return placeholderData;
  }
  return;
};
