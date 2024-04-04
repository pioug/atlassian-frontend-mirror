import type { Match } from '@atlaskit/adf-schema';

/** Created by scanning the Wikipedia page for all TLDs and selecting those that are common filenames, along
 * with customer complaints */
const tldsToNotAutoLinkify = [
  'name',
  'zip',
  'doc',
  'mov',

  // Ensure common 2 character file extensions aren't linkified without https prefix
  'md',
  // Postscript
  'ps',
  // C++
  'cc',
  // C#
  'cs',
  // f#
  'fs',
  // Go
  'go',
  // JavaScript
  'js',
  // Perl
  'pl',
  // Perl module
  'pm',
  // Python
  'py',
  // Ruby
  'rb',
  // Rust
  'rs',
  // Bash
  'sh',
  // Typescript
  'ts',
  // C#
  'cs',
  // Visual Basic
  'vb',
];

/**
 * Decide if a url should auto linkify, based on the TLD.
 * If URL is in a list of suspicious TLDs (eg. README.md), returns false
 * If URL is prefixed with http:// or https:// or www, returns true (allows linkify), as user intention is clear
 * this is a URL.
 * If the link is invalid (eg. missing a TLD), returns true (allows linkify)
 *
 * @param url Link that hasn't been already prefixed with http://, https:// or www.
 */
export function shouldAutoLinkifyTld(url: string): boolean {
  const startsWithHttpHttps = /^https?:\/\//.test(url);
  if (startsWithHttpHttps) {
    return true;
  }

  const startsWithWWW = /^www\./.test(url);
  if (startsWithWWW) {
    return true;
  }

  try {
    const hostname = new URL(`https://${url}`).hostname;
    const parts = hostname.split('.');
    const tld = parts.length > 1 ? parts[parts.length - 1] : null;
    if (parts[0] === '') {
      // If the domain is an empty string (ie the link is `.com`), it's invalid, so
      // automatically return true
      return true;
    }
    if (!tld) {
      return true;
    }
    return !tldsToNotAutoLinkify.includes(tld);
  } catch (e) {
    return true;
  }
}

/**
 * Check if url match uses tld we don't want to auto linkify
 * @param match Linkify Match
 * @returns True if should auto linkify, false otherwise
 */
export function shouldAutoLinkifyMatch(match: Match): boolean {
  return shouldAutoLinkifyTld(match.raw);
}
