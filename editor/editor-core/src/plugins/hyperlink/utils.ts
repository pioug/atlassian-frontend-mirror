import { Slice, Node, Schema } from 'prosemirror-model';
import { mapSlice } from '../../utils/slice';
import {
  isSafeUrl,
  linkify,
  Match,
  normalizeUrl as normaliseLinkHref,
} from '@atlaskit/adf-schema';

// Regular expression for a windows filepath in the format <DRIVE LETTER>:\<folder name>\
export const FILEPATH_REGEXP = /([a-zA-Z]:|\\)([^\/:*?<>"|]+\\)?([^\/:*?<>"| ]+(?=\s?))?/gim;

// Don't linkify if starts with $ or {
export const DONTLINKIFY_REGEXP = /^(\$|{)/;

/**
 * Instance of class LinkMatcher are used in autoformatting in place of Regex.
 * Hence it has been made similar to regex with an exec method.
 * Extending it directly from class Regex was introducing some issues, thus that has been avoided.
 */
export class LinkMatcher {
  static create(): RegExp {
    class LinkMatcherRegex {
      exec(str: string): Match | null {
        const stringsBySpace = str.slice(0, str.length - 1).split(' ');
        const lastStringBeforeSpace = stringsBySpace[stringsBySpace.length - 1];
        const isLastStringValid = lastStringBeforeSpace.length > 0;

        if (!str.endsWith(' ') || !isLastStringValid) {
          return null;
        }

        if (DONTLINKIFY_REGEXP.test(lastStringBeforeSpace)) {
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
      if (link === undefined) {
        throw new Error('Link not in schema - unable to linkify content');
      }
      if (isAllowedInParent && node.isText && !link.isInSet(node.marks)) {
        const linkified = [] as Node[];
        const text = node.text!;
        const matches: any[] = findLinkMatches(text);
        let pos = 0;
        const filepaths = findFilepaths(text);
        matches.forEach((match) => {
          if (isLinkInMatches(match.start, filepaths)) {
            return;
          }

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
interface filepathMatch {
  startIndex: number;
  endIndex: number;
}

export const findFilepaths = (
  text: string,
  offset: number = 0,
): Array<filepathMatch> => {
  // Creation of a copy of the RegExp is necessary as lastIndex is stored on it when we run .exec()
  const localRegExp = new RegExp(FILEPATH_REGEXP);
  let match;
  const matchesList = [];
  const maxFilepathSize = 260;
  while ((match = localRegExp.exec(text)) !== null) {
    const start = match.index + offset;
    let end = localRegExp.lastIndex + offset;
    if (end - start > maxFilepathSize) {
      end = start + maxFilepathSize;
    } // We don't care about big strings of text that are pretending to be filepaths!!
    matchesList.push({
      startIndex: start,
      endIndex: end,
    });
  }
  return matchesList;
};

export const isLinkInMatches = (
  linkStart: number,
  matchesList: Array<filepathMatch>,
): boolean => {
  for (let i = 0; i < matchesList.length; i++) {
    if (
      linkStart >= matchesList[i].startIndex &&
      linkStart < matchesList[i].endIndex
    ) {
      return true;
    }
  }
  return false;
};
