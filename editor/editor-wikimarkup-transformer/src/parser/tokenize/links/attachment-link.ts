import type { Schema, Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { Context } from '../../../interfaces';
import getMediaGroupNodeView from '../../nodes/mediaGroup';
import type { ContentLink } from './link-parser';

export function attachmentLinkResolver(
	link: ContentLink,
	schema: Schema,
	context: Context,
): PMNode[] | undefined {
	if (link.attachmentName) {
		return [getMediaGroupNodeView(schema, link.attachmentName, context)];
	}
	return;
}
