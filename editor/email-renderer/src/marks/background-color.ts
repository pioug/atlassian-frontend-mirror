import { createTag } from '../create-tag';
import type { MarkSerializerOpts } from '../interfaces';
import { serializeStyle } from '../serialize-style';

export default function backgroundColor({ mark, text }: MarkSerializerOpts): string {
	const css = serializeStyle({ 'background-color': mark.attrs.color });

	return createTag('span', { style: css }, text);
}
