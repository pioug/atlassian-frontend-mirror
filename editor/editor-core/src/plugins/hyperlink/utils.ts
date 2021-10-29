import { Slice, Node, Schema } from 'prosemirror-model';
import { mapSlice } from '../../utils/slice';
import {
  isSafeUrl,
  linkify,
  Match,
  normalizeUrl as normaliseLinkHref,
} from '@atlaskit/adf-schema';

/**
 * Instance of class LinkMatcher are used in autoformatting in place of Regex.
 * Hence it has been made similar to regex with an exec method.
 * Extending it directly from class Regex was introducing some issues, thus that has been avoided.
 */
export class LinkMatcher {
  static create(useUnpredictableInputRule: boolean): RegExp {
    class LinkMatcherRegex {
      exec(str: string): Match | null {
        const stringsBySpace = str.slice(0, str.length - 1).split(' ');
        const lastStringBeforeSpace = stringsBySpace[stringsBySpace.length - 1];
        const isLastStringValid = lastStringBeforeSpace.length > 0;

        if (!str.endsWith(' ') || !isLastStringValid) {
          return null;
        }

        const links: null | Match[] = linkify.match(lastStringBeforeSpace);
        if (!links || links.length === 0) {
          return null;
        }
        const lastMatch = links[links.length - 1];
        const lastLink: Match = links[links.length - 1];

        lastLink.input = str.substring(lastMatch.index);
        lastLink.length = lastLink.lastIndex - lastLink.index + 1;
        lastLink.index =
          str.lastIndexOf(lastStringBeforeSpace) + lastMatch.index;

        if (useUnpredictableInputRule) {
          // ugly hack to make this works with unpredictable input rules
          // prosemirror does this to find the positions:
          // `(match[0].length - text.length)`
          // @ts-ignore
          lastLink[0] = lastLink;
        }

        return lastLink;
      }
    }

    return new LinkMatcherRegex() as RegExp;
  }
}

/**
 * Adds protocol to url if needed.
 */
export function normalizeUrl(url?: string | null) {
  if (!url) {
    return '';
  }

  if (isSafeUrl(url)) {
    return url;
  }
  return normaliseLinkHref(url);
}

export function linkifyContent(schema: Schema): (slice: Slice) => Slice {
  return (slice: Slice): Slice =>
    mapSlice(slice, (node, parent) => {
      const isAllowedInParent =
        !parent || parent.type !== schema.nodes.codeBlock;
      const link = node.type.schema.marks.link;
      if (isAllowedInParent && node.isText && !link.isInSet(node.marks)) {
        const linkified = [] as Node[];
        const text = node.text!;
        const matches: any[] = findLinkMatches(text);
        let pos = 0;
        matches.forEach((match) => {
          if (match.start > 0) {
            linkified.push(node.cut(pos, match.start));
          }
          linkified.push(
            node
              .cut(match.start, match.end)
              .mark(
                link
                  .create({ href: normalizeUrl(match.href) })
                  .addToSet(node.marks),
              ),
          );
          pos = match.end;
        });
        if (pos < text.length) {
          linkified.push(node.cut(pos));
        }
        return linkified;
      }
      return node;
    });
}

export function getLinkDomain(url: string): string {
  // Remove protocol and www., if either exists
  const withoutProtocol = url.toLowerCase().replace(/^(.*):\/\//, '');
  const withoutWWW = withoutProtocol.replace(/^(www\.)/, '');

  // Remove port, fragment, path, query string
  return withoutWWW.replace(/[:\/?#](.*)$/, '');
}

export function isFromCurrentDomain(url: string): boolean {
  if (!window || !window.location) {
    return false;
  }
  const currentDomain = window.location.hostname;
  const linkDomain = getLinkDomain(url);
  return currentDomain === linkDomain;
}

interface LinkMatch {
  start: number;
  end: number;
  title: string;
  href: string;
}

function findLinkMatches(text: string): LinkMatch[] {
  const matches: LinkMatch[] = [];
  let linkMatches: '' | null | Match[] = text && linkify.match(text);
  if (linkMatches && linkMatches.length > 0) {
    linkMatches.forEach((match) => {
      matches.push({
        start: match.index,
        end: match.lastIndex,
        title: match.raw,
        href: match.url,
      });
    });
  }
  return matches;
}
