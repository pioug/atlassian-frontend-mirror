import { createTag } from '../create-tag';
import type { MarkSerializerOpts } from '../interfaces';
import { createClassName } from '../styles/util';

export const styles: string = `
.${createClassName('mark-em')} {
  font-style: italic;
}
`;

export default function em({ text }: MarkSerializerOpts): string {
	return createTag('span', { class: createClassName('mark-em') }, text);
}
