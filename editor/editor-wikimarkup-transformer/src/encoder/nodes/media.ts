import { Node as PMNode } from 'prosemirror-model';
import { NodeEncoder, NodeEncoderOpts } from '..';

export const media: NodeEncoder = (
  node: PMNode,
  { context, parent }: NodeEncoderOpts = {},
): string => {
  let wikiAttrs: string[] = [];

  // Parent width takes precedence over internal dimension attributes
  if (parent && parent.attrs.width) {
    // Parent width is defined in percents
    wikiAttrs.push(`width=${parent.attrs.width}%`);
  } else {
    if (node.attrs.width) {
      wikiAttrs.push(`width=${node.attrs.width}`);
    }
    if (node.attrs.height) {
      wikiAttrs.push(`height=${node.attrs.height}`);
    }
  }

  if (node.attrs.alt) {
    wikiAttrs.push(`alt="${node.attrs.alt}"`);
  }

  if (node.marks.length) {
    const linkMark = node.marks.find((mark) => mark.type.name === 'link');
    if (linkMark) {
      wikiAttrs.push(`href="${linkMark?.attrs.href}"`);
    }
  }

  let fileName: string;

  if (node.attrs.type === 'external') {
    fileName = node.attrs.url;
  } else {
    fileName =
      context?.conversion?.mediaConversion?.[node.attrs.id]?.transform ??
      node.attrs.id;
  }
  if (context?.conversion?.mediaConversion?.[node.attrs.id]?.embed === false) {
    return `[^${fileName}]`;
  }
  if (wikiAttrs.length) {
    return `!${fileName}|${wikiAttrs.join(',')}!`;
  }
  // default to thumbnail if no width or height is set
  return `!${fileName}|thumbnail!`;
};
