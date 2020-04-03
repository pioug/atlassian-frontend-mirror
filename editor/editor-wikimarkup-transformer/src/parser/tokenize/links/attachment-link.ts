import { ContentLink } from './link-parser';
import getMediaGroupNodeView from '../../nodes/mediaGroup';
import { Schema, Node as PMNode } from 'prosemirror-model';
import { Context } from '../../../interfaces';

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
