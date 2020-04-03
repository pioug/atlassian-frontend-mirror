import { Schema, Node as PMNode } from 'prosemirror-model';
import { Token, TokenParser } from './';
import { Context, ConversionMap } from '../../interfaces';
import { isNotBlank } from '../utils/text';

/**
 * Inline Card From Text (ICFT).
 *
 * When we convert WikiMarkup to ADF we stamp all issue keys URLs with the
 * #icft= syntax to identify  which keys should be involved by brackets
 * [XX-999] from the ones which should be blue links in the ADF to WikiMarkup
 * convertion.
 */
export const INLINE_CARD_FROM_TEXT_STAMP = /(#icft=)([A-Z][A-Z]+-[0-9]+)/;

export interface Issue {
  key: string;
  url: string;
}

export const issueKey: TokenParser = ({ input, position, schema, context }) => {
  // This scenario happens when context is empty
  if (!context.issueKeyRegex) {
    return fallback(input, position);
  }

  const match = input.substring(position).match(context.issueKeyRegex);

  if (!match) {
    return fallback(input, position);
  }

  const issue: Issue | null = getIssue(context, match[0]);

  // This scenario happens when context doesn't has all the issues inside a markup
  if (!issue) {
    return fallback(input, position);
  }

  const charBefore = input.charAt(position - 1);
  const charAfter = input.charAt(position + issue.key.length);
  if (
    (isNotBlank(charBefore) && isNotAllowedChars(charBefore)) ||
    (isNotBlank(charAfter) && isNotAllowedChars(charAfter))
  ) {
    return fallback(input, position);
  }

  return {
    type: 'pmnode',
    nodes: buildInlineCard(schema, issue),
    length: match[0].length,
  };
};

const fallback = (input: string, position: number): Token => ({
  type: 'text',
  text: input.substr(position, 1),
  length: 1,
});

export const getIssue = (context: Context, key: string): Issue | null =>
  context.conversion &&
  context.conversion.inlineCardConversion &&
  context.conversion.inlineCardConversion[key]
    ? { key, url: context.conversion.inlineCardConversion[key] }
    : null;

export const buildInlineCard = (schema: Schema, issue: Issue): PMNode[] => {
  return [
    schema.nodes.inlineCard.createChecked({
      url: withInlineCardFromTextStamp(issue),
    }),
  ];
};

const withInlineCardFromTextStamp = (issue: Issue): string =>
  INLINE_CARD_FROM_TEXT_STAMP.test(issue.url)
    ? issue.url
    : `${issue.url}#icft=${issue.key}`;

const isNotAllowedChars = (char: string): boolean => !/\s|\(|\)|!/.test(char);

export const buildIssueKeyRegex = (
  inlineCardConversion?: ConversionMap,
): RegExp | undefined => {
  if (!inlineCardConversion) {
    return undefined;
  }

  const pattern: string = Object.keys(inlineCardConversion).join('|');

  if (!pattern) {
    return undefined;
  }
  return new RegExp(`^(${pattern})`);
};
