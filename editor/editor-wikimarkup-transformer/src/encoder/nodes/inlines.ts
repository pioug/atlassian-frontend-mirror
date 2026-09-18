import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { NodeEncoder, NodeEncoderOpts } from '..';
import { date } from './date';
import { emoji } from './emoji';
import { hardBreak } from './hard-break';
import { inlineCard } from './inline-card';
import { mediaInline } from './media-inline';
import { mention } from './mention';
import { status } from './status';
import { text } from './text';
import { unknown } from './unknown';

const inlinesEncoderMapping: { [key: string]: NodeEncoder } = {
	emoji,
	hardBreak,
	mediaInline,
	mention,
	text,
	inlineCard,
	status,
	date,
};

export const inlines: NodeEncoder = (node: PMNode, opts?: NodeEncoderOpts): string => {
	const encoder = inlinesEncoderMapping[node.type.name];
	if (encoder) {
		return encoder(node, opts);
	}
	return unknown(node);
};
