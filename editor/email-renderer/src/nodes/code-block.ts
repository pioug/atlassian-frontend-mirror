import { NodeSerializerOpts } from '../interfaces';
import { createTag } from '../create-tag';
import { codeFontFamily } from '../styles/common';
import { N20 } from '@atlaskit/adf-schema';
import { createClassName } from '../styles/util';

const className = createClassName(`codeBlock`);

export const styles = `
.${className}-pre {
  white-space: pre-wrap;
  font-size: 12px;
  line-height: 20px;
  font-family: ${codeFontFamily};
  color: rgb(23, 43, 77);
  background: ${N20};
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  margin: 0px;
  overflow-wrap: break-word;
}
.${className}-div {
  padding: 8px 16px;
  background-color: ${N20};
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  color: rgb(23, 43, 77);
}
`;

export default function codeBlock({ text }: NodeSerializerOpts) {
  const sanitizedText = (text || '').replace(/\n/g, '<br/>');

  const pre = createTag('pre', { class: `${className}-pre` }, sanitizedText);

  return createTag('div', { class: `${className}-div` }, pre);
}
