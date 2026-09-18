import { createTag } from '../create-tag';
import type { MarkSerializerOpts } from '../interfaces';
import { createClassName } from '../styles/util';

export const styles: string = `
.${createClassName('mark-strike')} {
  text-decoration: line-through;
}
`;
export default function strike({ text }: MarkSerializerOpts): string {
	return createTag('span', { class: createClassName('mark-strike') }, text);
}
