import { N30 } from '@atlaskit/adf-schema';
import { createTag } from '../create-tag';
import { createClassName } from '../styles/util';

export const styles = `
.${createClassName('rule')} {
  border: none;
  border-bottom: 1px solid ${N30};
}
`;

export default function rule() {
  return createTag('hr', { class: createClassName('rule') });
}
