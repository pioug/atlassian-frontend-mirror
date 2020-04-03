import { MarkSerializerOpts } from '../interfaces';
import { createTag } from '../create-tag';
import { createClassName } from '../styles/util';
import { codeFontFamily } from '../styles/common';
import { N20 } from '@atlaskit/adf-schema';

export const styles = `
.${createClassName('mark-code')} {
  background: ${N20};
  color: rgb(23, 43, 77);
  border-radius: 3px;
  padding: 2px 4px;
  font-size: 12px;
  line-height: 24px;
  font-family: ${codeFontFamily};
}`;

export default function code({ text }: MarkSerializerOpts) {
  return createTag('code', { class: createClassName('mark-code') }, text);
}
