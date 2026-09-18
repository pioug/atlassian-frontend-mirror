import { createTag } from '../create-tag';
import type { MarkSerializerOpts } from '../interfaces';
import { createClassName } from '../styles/util';

export const styles: string = `
.${createClassName('mark-underline')} {
  text-decoration: underline;
}
`;

export default function strong({ text }: MarkSerializerOpts): string {
	return createTag('span', { class: createClassName('mark-underline') }, text);
}
