import { Node as PMNode, Schema } from 'prosemirror-model';
import { Context } from '../../interfaces';

export default function getMediaGroupNodeView(
  schema: Schema,
  filename: string,
  context: Context = {},
): PMNode {
  const { media, mediaGroup } = schema.nodes;

  // try to look up media ID from conversion context
  const id =
    context?.conversion?.mediaConversion?.[filename]?.transform ?? filename;

  // try to look up collection from media context
  const collection =
    context.hydration &&
    context.hydration.media &&
    context.hydration.media.targetCollectionId;
  const mediaNode = media.createChecked({
    id,
    type: 'file',
    collection: collection || '',
  });

  return mediaGroup.createChecked({}, mediaNode);
}
