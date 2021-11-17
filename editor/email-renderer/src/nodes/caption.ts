import { applyMarks } from '../apply-marks';
import { createTag } from '../create-tag';
import { createClassName } from '../styles/util';
import { NodeSerializerOpts } from '../interfaces';
import { lineHeight, fontSize } from '../styles/common';

const className = createClassName('caption');

export const styles = `
.${className} {
  mso-line-height-rule: exactly;
  line-height: ${lineHeight};
  font-size: ${fontSize};
  margin-top: 8px;
  text-align: center;
  position: relative;
  color: rgb(80, 95, 121);
}
`;

export default function caption({ text, marks }: NodeSerializerOpts) {
  const caption = createTag('div', { class: className }, text || '&nbsp;');
  return applyMarks(marks, caption);
}
