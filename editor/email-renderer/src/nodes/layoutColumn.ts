import { createTag } from '../create-tag';
import type { NodeSerializerOpts } from '../interfaces';

export default function layoutColumn({ text }: NodeSerializerOpts): string {
	return createTag('div', {}, text);
}
