import { N50 } from '@atlaskit/adf-schema';
import { createTag } from '../create-tag';
import { NodeSerializerOpts } from '../interfaces';
import { createClassName } from '../styles/util';

const className = createClassName('tableNode');

export const styles = `
.${className} {
  border: 1px solid ${N50};
  border-collapse: collapse;
  width: 100%;
  table-layout: fixed;
}
.${className}-wrapper {
  margin-bottom: 20px;
  margin-top: 20px;
}
`;

export const numberedColumnWidth = 42;

export default function table({ text, node }: NodeSerializerOpts) {
  let colgroup: string = '';
  if (node.attrs && node.attrs.isNumberColumnEnabled) {
    const style = `width: ${numberedColumnWidth}px`;
    const colTag = createTag('col', { style });
    colgroup = createTag('colgroup', undefined, colTag);
  }

  const table = createTag('table', { class: className }, colgroup + text);
  return createTag('div', { class: `${className}-wrapper` }, table);
}
