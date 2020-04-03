import { ContentLink } from './link-parser';
import { Schema, Node as PMNode } from 'prosemirror-model';
import { Context } from '../../../interfaces';

export function mentionLinkResolver(
  link: ContentLink,
  schema: Schema,
  context: Context,
): PMNode[] | undefined {
  // [CS-1896] Empty mention nodes should fallback to plaintext
  if (link.notLinkBody === '~accountid:' || link.notLinkBody === '~') {
    return [
      schema.nodes.paragraph.createChecked({}, [schema.nodes.text.create({})]),
    ];
  }

  if (link.notLinkBody.startsWith('~')) {
    const mentionText = link.notLinkBody.substring(1);
    const id =
      context.conversion &&
      context.conversion.mentionConversion &&
      context.conversion.mentionConversion[mentionText]
        ? context.conversion.mentionConversion[mentionText]
        : mentionText;

    return [
      schema.nodes.mention.createChecked({
        id,
      }),
    ];
  }
  return;
}
