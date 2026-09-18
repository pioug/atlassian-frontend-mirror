import { createTag } from '../create-tag';
import type { MarkSerializerOpts } from '../interfaces';
import { serializeStyle } from '../serialize-style';

export default function textColor({ mark, text }: MarkSerializerOpts): string {
	const css = serializeStyle({ color: mark.attrs.color });

	return createTag('span', { style: css }, text);
}
