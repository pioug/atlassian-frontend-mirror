/**
 * This file has been partially duplicated in packages/editor/adf-schema/src/utils/url.ts
 * Any changes made here should be mirrored there until the duplicate behaviour is resolved
 * Ticket for dedeplication: https://product-fabric.atlassian.net/browse/EDM-7138
 * Ticket for fixing linkification of filename-like urls: https://product-fabric.atlassian.net/browse/EDM-7190
 */
import LinkifyIt from 'linkify-it';

const linkify = LinkifyIt();
linkify.add('sourcetree:', 'http:');
linkify.add('jamfselfservice:', 'http:');
linkify.add('notes:', 'http:');

const tlds =
  'biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф'.split(
    '|',
  );
const tlds2Char =
  'a[cdefgilmnoqrtuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrtuvwxyz]|n[acefgilopruz]|om|p[aefghkmnrtw]|qa|r[eosuw]|s[abcdegijklmnrtuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]';
tlds.push(tlds2Char);
linkify.tlds(tlds, false);

const whitelistedURLPatterns = [
  /^https?:\/\/[^\s]*$/im,
  /^ftps?:\/\//im,
  /^gopher:\/\//im,
  /^integrity:\/\//im,
  /^file:\/\//im,
  /^smb:\/\//im,
  /^dynamicsnav:\/\//im,
  /^jamfselfservice:\/\/[^\s]*$/im,
  /^\//im,
  /^mailto:/im,
  /^skype:/im,
  /^callto:[^\s]*$/im,
  /^facetime:[^\s]*$/im,
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
  /^sourcetree:/im,
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
  /^foo:/im,
  /^#/im,
];

const normaliseLinkHref = (url?: string) => {
  const match = getLinkMatch(url);
  return (match && match.url) || null;
};

const getLinkMatch = (str?: string): Match | null => {
  if (!str) {
    return null;
  }

  let match: null | Match[] = linkifyMatch(str);
  if (!match.length) {
    match = linkify.match(str);
  }

  return match &&
    match.length > 0 &&
    match[0].index === 0 &&
    match[0].lastIndex === str.trim().length
    ? match[0]
    : null;
};

const LINK_REGEXP =
  /(https?|ftp|jamfselfservice|gopher|dynamicsnav|integrity|file|smb):\/\/[^\s]+/;

const linkifyMatch = (text: string): Match[] => {
  const matches: Match[] = [];

  if (!LINK_REGEXP.test(text)) {
    return matches;
  }

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

interface Match {
  schema: any;
  index: number;
  lastIndex: number;
  raw: string;
  text: string;
  url: string;
  length?: number;
  input?: string;
}

export const isSafeUrl = (url: string): boolean => {
  const urlTrimmed = url.trim();
  return whitelistedURLPatterns.some(p => p.test(urlTrimmed));
};

/**
 * Adds protocol to url if needed.
 * If url is not valid, returns empty string or null.
 */
export function normalizeUrl(url?: string | null): string | null {
  if (!url) {
    return '';
  }

  const urlWithoutNewlines = url.replace(/[\r\n]+/g, '');

  if (isSafeUrl(urlWithoutNewlines)) {
    return urlWithoutNewlines.trim();
  }

  return normaliseLinkHref(urlWithoutNewlines);
}
