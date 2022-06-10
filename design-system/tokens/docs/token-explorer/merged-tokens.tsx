import darkTheme from '../../src/artifacts/tokens-raw/atlassian-dark';
import lightTheme from '../../src/artifacts/tokens-raw/atlassian-light';
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

const mergedTokens: TransformedTokenMerged[] = mergeTokens(
  lightTheme as TransformedTokenWithAttributes[],
);

export default mergedTokens;
