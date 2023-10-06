import designTokens from '@atlaskit/tokens/token-names';
import { light as rawTokens } from '@atlaskit/tokens/tokens-raw';

import Search from '../../theme-to-design-tokens/utils/fuzzy-search';

import { cleanMeta } from './meta';

type DesignTokensMap = typeof designTokens;
type DesignTokenJs = keyof DesignTokensMap;
type DesignTokenCss = DesignTokensMap[DesignTokenJs];

const MISSING_TOKEN_NAME = 'MISSING_TOKEN';
const ACTIVE_TOKENS = rawTokens
  .filter((token) => token.attributes.state === 'active')
  .map((token) => token.name.replace(/\.\[default\]/g, ''))
  .filter(
    (token) => !token.includes('UNSAFE') && !token.includes('interaction'),
  );

const COLOR_TOKEN_SEARCH_TYPES = [
  'text',
  'link',
  'icon',
  'border',
  'background',
  'blanket',
  'skeleton',
  'chart',
  'surface',
  'shadow',
];

const createFuzzySearch = (tokens: string[]) => Search(tokens, false);

function filterTokens(meta: string[]) {
  const commonSearchTypes = COLOR_TOKEN_SEARCH_TYPES.filter((type) =>
    meta.includes(type),
  );
  return commonSearchTypes.length !== 0
    ? ACTIVE_TOKENS.filter((token) =>
        commonSearchTypes.some(
          (type) =>
            token.startsWith(`color.${type}`) ||
            token.startsWith(`elevation.${type}`),
        ),
      )
    : ACTIVE_TOKENS;
}

export default function findToken(
  meta: string[],
): DesignTokenCss | typeof MISSING_TOKEN_NAME {
  const filteredTokens = filterTokens(meta);
  const tokenFuzzySearch = createFuzzySearch(filteredTokens);

  const cleanSearchTerms = cleanMeta(meta).join(' ');
  const results: DesignTokenJs[][] | null =
    tokenFuzzySearch.get(cleanSearchTerms);
  if (!results) {
    return MISSING_TOKEN_NAME;
  }

  const candidates = results.map((result) => result[1]);
  const bestCandidate = designTokens[candidates[0]];

  return bestCandidate;
}
