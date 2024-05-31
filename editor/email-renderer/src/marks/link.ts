import type { MarkSerializerOpts } from '../interfaces';
import { createTag } from '../create-tag';
import { createClassName } from '../styles/util';

export const styles = `
.${createClassName('mark-link')} {
  border: none;
  background: transparent;
  color: #0052cc;
  text-decoration: none;
}
`;
export default function link({ mark, text, context }: MarkSerializerOpts) {
	const baseURL = context?.baseURL;
	const { href, title } = mark.attrs;

	const resolveRelativeOrAbsoluteURL = (href: string, baseURL: string) => {
		try {
			const url = new URL(href, baseURL);
			return url.href;
		} catch (e) {
			return href;
		}
	};

	return createTag(
		'a',
		{
			href: resolveRelativeOrAbsoluteURL(href, baseURL),
			title,
			class: createClassName('mark-link'),
		},
		text,
	);
}
