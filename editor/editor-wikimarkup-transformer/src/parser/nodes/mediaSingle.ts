import { Node as PMNode, Schema } from 'prosemirror-model';
import { LINK_TEXT_REGEXP } from '../tokenize/link-text';
import { Context } from '../../interfaces';

const defaultWidth = 200;
const defaultHeight = 183;

const clamp = (input: number, lower: number, upper: number) => {
  if (upper !== undefined) {
    input = input <= upper ? input : upper;
  }
  if (lower !== undefined) {
    input = input >= lower ? input : lower;
  }
  return input;
};

export default function getMediaSingleNodeView(
  schema: Schema,
  filename: string,
  attrs: { [key: string]: string },
  context: Context = {},
): PMNode {
  const { media, mediaSingle } = schema.nodes;
  const { link } = schema.marks;
  const mediaMarks = [];

  let mediaNodeAttrs: { width?: number; height?: number; alt?: string } = {
    width: defaultWidth,
    height: defaultHeight,
  };
  const mediaSingleAttrs: any = { layout: 'center' };

  if (attrs.width && attrs.width.endsWith('%')) {
    const parsed = parseInt(attrs.width, 10);
    if (!isNaN(parsed)) {
      mediaSingleAttrs.width = clamp(parsed, 0, 100);
    }
    mediaNodeAttrs = {};
  } else {
    if (attrs.width) {
      const parsed = parseInt(attrs.width, 10);
      if (!isNaN(parsed)) {
        mediaNodeAttrs.width = parsed;
      }
    }

    if (attrs.height) {
      const parsed = parseInt(attrs.height, 10);
      if (!isNaN(parsed)) {
        mediaNodeAttrs.height = parsed;
      }
    }
  }

  if (attrs.href) {
    const href = attrs.href.replace(/^"(.+)"$/, '$1');
    mediaMarks.push(link.create({ href }));
  }

  if (attrs.alt) {
    // strip wrapping quotes if they exist
    const altText = attrs.alt.replace(/^"(.+)"$/, '$1');
    mediaNodeAttrs.alt = altText;
  }

  if (filename.match(LINK_TEXT_REGEXP)) {
    const externalMediaNode = media.createChecked(
      {
        type: 'external',
        url: filename,
        ...mediaNodeAttrs,
      },
      undefined,
      mediaMarks,
    );

    return mediaSingle.createChecked(mediaSingleAttrs, externalMediaNode);
  } else {
    // try to look up media ID from conversion context
    const id =
      context?.conversion?.mediaConversion?.[filename]?.transform ?? filename;
    // try to look up collection from media context
    const collection =
      context.hydration &&
      context.hydration.media &&
      context.hydration.media.targetCollectionId;
    const mediaNode = media.createChecked(
      {
        id,
        type: 'file',
        collection: collection || '',
        ...mediaNodeAttrs,
      },
      undefined,
      mediaMarks,
    );

    return mediaSingle.createChecked(mediaSingleAttrs, mediaNode);
  }
}
