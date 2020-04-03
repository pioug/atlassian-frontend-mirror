import { Node as PMNode } from 'prosemirror-model';
import { encode, NodeEncoder } from '..';

const panelTypeColorMapping: { [key: string]: string } = {
  info: '#deebff',
  note: '#eae6ff',
  success: '#e3fcef',
  warning: '#fffae6',
  error: '#ffebe6',
};

export const panel: NodeEncoder = (node: PMNode): string => {
  const result: string[] = [];
  node.forEach(n => {
    result.push(encode(n));
  });
  return `{panel:bgColor=${panelTypeColorMapping[node.attrs.panelType] || ''}}
${result.join('\n\n')}
{panel}`;
};
