import { createTag } from '../create-tag';
import type { NodeSerializerOpts } from '../interfaces';

export default function layoutSection({ text }: NodeSerializerOpts): string {
	return createTag('div', {}, text);
}
