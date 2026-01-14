import { createTag } from '../create-tag';
import { createClassName } from '../styles/util';
import { type MarkSerializerOpts } from '../interfaces';

export const styles: string = `
.${createClassName('mark-strike')} {
  text-decoration: line-through;
}
`;
export default function strike({ text }: MarkSerializerOpts): string {
	return createTag('span', { class: createClassName('mark-strike') }, text);
}
