/**
 * This file has been partially duplicated in packages/linking-platform/linking-common/src/url.ts
 * Any changes made here should be mirrored there.
 * Ticket for dedeplication: https://product-fabric.atlassian.net/browse/EDM-7138
 * Ticket for fixing linkification of filename-like urls: https://product-fabric.atlassian.net/browse/EDM-7190
 */
import LinkifyIt from 'linkify-it';

const whitelistedURLPatterns = [
  /^https?:\/\//im,
  /^ftps?:\/\//im,
  /^gopher:\/\//im,
  /^integrity:\/\//im,
  /^file:\/\//im,
  /^smb:\/\//im,
  /^dynamicsnav:\/\//im,
  /^jamfselfservice:\/\//im,
  /^\//im,
  /^mailto:/im,
  /^skype:/im,
  /^callto:/im,
  /^facetime:/im,
  /^git:/im,
  /^irc6?:/im,
  /^news:/im,
  /^nntp:/im,
  /^feed:/im,
  /^cvs:/im,
  /^svn:/im,
  /^mvn:/im,
  /^ssh:/im,
  /^scp:\/\//im,
  /^sftp:\/\//im,
  /^itms:/im,
  // This is not a valid notes link, but we support this pattern for backwards compatibility
  /^notes:/im,
  /^notes:\/\//im,
  /^hipchat:\/\//im,
  // This is not a valid sourcetree link, but we support this pattern for backwards compatibility
  /^sourcetree:/im,
  /^sourcetree:\/\//im,
  /^urn:/im,
  /^tel:/im,
  /^xmpp:/im,
  /^telnet:/im,
  /^vnc:/im,
  /^rdp:/im,
  /^whatsapp:/im,
  /^slack:/im,
  /^sips?:/im,
  /^magnet:/im,
  /^#/im,
];

/**
 * Please notify the Editor Mobile team (Slack: #help-mobilekit) if the logic for this changes.
 */
export const isSafeUrl = (url: string): boolean => {
  const urlTrimmed = url.trim();
  if (urlTrimmed.length === 0) {
    return true;
  }
  return whitelistedURLPatterns.some((p) => p.test(urlTrimmed));
};

export interface Match {
  schema: any;
  index: number;
  lastIndex: number;
  raw: string;
  text: string;
  url: string;
  length?: number;
  input?: string;
}

export const linkify = LinkifyIt();
linkify.add('sourcetree:', 'http:');
linkify.add('jamfselfservice:', 'http:');

const urlWithoutSpacesValidator: LinkifyIt.Rule = {
  validate: /[^\s]+/,
};

// `tel:` URI spec is https://datatracker.ietf.org/doc/html/rfc3966
// We're not validating the phone number or separators - but if there's a space it definitely isn't a valid `tel:` URI
linkify.add('tel:', urlWithoutSpacesValidator);

linkify.add('notes:', 'http:');

const tlds =
  'biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф'.split(
    '|',
  );
const tlds2Char =
  'a[cdefgilmnoqrtuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrtuvwxyz]|n[acefgilopruz]|om|p[aefghkmnrtw]|qa|r[eosuw]|s[abcdegijklmnrtuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]';
tlds.push(tlds2Char);
linkify.tlds(tlds, false);

// linkify-it mishandles closing braces on long urls, so we preference using our own regex first:
// https://product-fabric.atlassian.net/browse/ED-13669
export const LINK_REGEXP =
  /(https?|ftp|jamfselfservice|gopher|dynamicsnav|integrity|file|smb):\/\/[^\s]+/;

/** Attempt to find a link match using a regex string defining a URL */
export const linkifyMatch = (text: string): Match[] => {
  if (!LINK_REGEXP.test(text)) {
    return [];
  }

  const matches: Match[] = [];
  let startpos = 0;
  let substr;

  while ((substr = text.substr(startpos))) {
    const link = (substr.match(LINK_REGEXP) || [''])[0];
    if (link) {
      const index = substr.search(LINK_REGEXP);
      const start = index >= 0 ? index + startpos : index;
      const end = start + link.length;
      matches.push({
        index: start,
        lastIndex: end,
        raw: link,
        url: link,
        text: link,
        schema: '',
      });
      startpos += end;
    } else {
      break;
    }
  }

  return matches;
};

/**
 * Attempt to find a link match. Tries to use our regex search first.
 * If this doesn't match (e.g. no protocol), try using linkify-it library.
 * Returns null if url string empty or no string given, or if no match found.
 */
export function getLinkMatch(str?: string): Match | null {
  if (!str) {
    return null;
  }
  // linkify-it mishandles closing braces on long urls, so we preference using our own regex first:
  // https://product-fabric.atlassian.net/browse/ED-13669
  let match: null | Match[] = linkifyMatch(str);
  if (!match.length) {
    match = linkify.match(str);
  }
  return match && match[0];
}

/**
 * Adds protocol to url if needed.
 * Returns empty string if no url given or if no link match found.
 */
export function normalizeUrl(url?: string) {
  const match = getLinkMatch(url);
  return (match && match.url) || '';
}

/**
 * checks if root relative link
 */
export function isRootRelative(url: string) {
  return url.startsWith('/');
}
