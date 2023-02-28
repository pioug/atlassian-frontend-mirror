import darkTheme from '../../src/artifacts/tokens-raw/atlassian-dark';
import lightTheme from '../../src/artifacts/tokens-raw/atlassian-light';
import spacingTheme from '../../src/artifacts/tokens-raw/atlassian-spacing';
import { getTokenId } from '../../src/utils/token-ids';

import type {
  TransformedTokenMerged,
  TransformedTokenWithAttributes,
} from './types';

export const mergeTokens = (tokens: TransformedTokenWithAttributes[]) =>
  tokens.map((lightToken) => {
    const darkToken = darkTheme.find((token) => token.name === lightToken.name);
    const mergedToken: TransformedTokenMerged = {
      ...lightToken,
      darkToken: (darkToken as TransformedTokenWithAttributes)!,
      nameClean: getTokenId(lightToken.name),
    };

    return mergedToken;
  });

const mergedTokens: TransformedTokenMerged[] = mergeTokens([
  ...(lightTheme as TransformedTokenWithAttributes[]),
  ...(spacingTheme as TransformedTokenWithAttributes[]),
]);

export default mergedTokens;
