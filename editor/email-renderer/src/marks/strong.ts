import { createTag } from '../create-tag';
import { createClassName } from '../styles/util';
import { type MarkSerializerOpts } from '../interfaces';

export const styles: string = `
.${createClassName('mark-strong')} {
  font-weight: bold;
}
`;

export default function strong({ text }: MarkSerializerOpts): string {
	return createTag('span', { class: createClassName('mark-strong') }, text);
}
