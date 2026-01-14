import { type NodeSerializerOpts } from '../interfaces';
import { createTag } from '../create-tag';

export default function layoutColumn({ text }: NodeSerializerOpts): string {
	return createTag('div', {}, text);
}
