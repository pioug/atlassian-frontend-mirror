import { normalizeUrl } from '@atlaskit/adf-schema';
import { Node } from 'prosemirror-model';
import { md } from '../../paste/md';

export function shouldReplaceLink(
  node: Node,
  compareLinkText: boolean = true,
  compareToUrl?: string,
) {
  const linkMark = node.marks.find((mark) => mark.type.name === 'link');
  if (!linkMark) {
    // not a link anymore
    return false;
  }

  // ED-6041: compare normalised link text after linkfy from Markdown transformer
  // instead, since it always decodes URL ('%20' -> ' ') on the link text

  const normalisedHref = normalizeUrl(
    md.normalizeLinkText(linkMark.attrs.href),
  );

  const normalizedLinkText = normalizeUrl(
    md.normalizeLinkText(node.text || ''),
  );

  if (compareLinkText && normalisedHref !== normalizedLinkText) {
    return false;
  }

  if (compareToUrl) {
    const normalizedUrl = normalizeUrl(md.normalizeLinkText(compareToUrl));
    if (normalizedUrl !== normalisedHref) {
      return false;
    }
  }

  return true;
}
