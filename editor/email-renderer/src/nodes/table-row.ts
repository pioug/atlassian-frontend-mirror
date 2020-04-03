import { N20, N50, N200 } from '@atlaskit/adf-schema';
import { createTag } from '../create-tag';
import { createClassName } from '../styles/util';
import { NodeSerializerOpts } from '../interfaces';
import { numberedColumnWidth } from './table';

export const styles = `
.${createClassName('tableRow-numCol')} {
  background-color: ${N20};
  background-clip: padding-box;
  border: 1px solid ${N50};
  border-right-width: 0;
  border-bottom-width: 0;
  height: auto;
  padding: 8px;
  text-align: center;
  vertical-align: top;
  width: ${numberedColumnWidth}px;
}
.${createClassName('tableRow-numCol-p')} {
  margin: 0;
  padding: 0px;
  mso-line-height-rule: exactly;
  line-height: 24px;
  font-size: 14px;
  color: ${N200};
}
`;

export default function tableRow({ text, attrs }: NodeSerializerOpts) {
  let numberedColumn = '';
  if (attrs && attrs.isNumberColumnEnabled) {
    const paragraph = createTag(
      'p',
      { class: createClassName('tableRow-numCol-p') },
      attrs.index,
    );
    numberedColumn = createTag(
      'td',
      { class: createClassName('tableRow-numCol') },
      paragraph,
    );
  }
  return createTag('tr', {}, numberedColumn + text);
}
