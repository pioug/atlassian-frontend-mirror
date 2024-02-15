import { RecognitionException } from 'antlr4ts/RecognitionException';

import { JQLParser } from '@atlaskit/jql-parser';

import { ignoredTokens } from './constants';

export const getTokenDisplayNames = (
  parser: JQLParser,
  tokens: number[],
): string[] => {
  return tokens.map(tokenType =>
    parser.vocabulary.getDisplayName(tokenType).replace(/^'|'$/g, ''),
  );
};

export const getExpectedTokensFromParserOrException = (
  parser: JQLParser,
  exception?: RecognitionException,
) => {
  // Read expected tokens from the exception if present, as it refers to the expected input symbols at the time the
  // exception was thrown (whereas JQLParser will give us possible tokens from the current parser state).
  const expectedTokenSet =
    exception?.expectedTokens ?? parser.getExpectedTokens();

  return (
    expectedTokenSet
      .toArray()
      // Show the token if it's not ignored
      .filter(tokenType => !ignoredTokens.has(tokenType))
  );
};
