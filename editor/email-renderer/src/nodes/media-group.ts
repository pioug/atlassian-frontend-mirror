import { type NodeSerializerOpts } from '../interfaces';
import { createTag } from '../create-tag';
import { serializeStyle } from '../serialize-style';

export default function mediaGroup({ text }: NodeSerializerOpts): string {
	const style = serializeStyle({
		width: '100%',
	});

	return createTag('div', { style }, text);
}
