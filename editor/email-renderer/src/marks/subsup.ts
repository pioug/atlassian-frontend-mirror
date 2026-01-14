import { createTag } from '../create-tag';
import { type MarkSerializerOpts } from '../interfaces';

export default function subsup({ mark, text }: MarkSerializerOpts): string {
	return createTag(mark.attrs.type, {}, text);
}
