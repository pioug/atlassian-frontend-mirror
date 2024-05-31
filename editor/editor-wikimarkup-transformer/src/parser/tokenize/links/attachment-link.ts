import { type ContentLink } from './link-parser';
import getMediaGroupNodeView from '../../nodes/mediaGroup';
import { type Schema, type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { type Context } from '../../../interfaces';

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
