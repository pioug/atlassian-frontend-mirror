import Search from '../../theme-to-design-tokens/utils/fuzzy-search';
import { activeTokens } from '../../utils/tokens';

import { cleanMeta } from './meta';

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

function filterTokens(meta: string[]) {
  const commonSearchTypes = COLOR_TOKEN_SEARCH_TYPES.filter((type) =>
    meta.includes(type),
  );
  return commonSearchTypes.length !== 0
    ? activeTokens.filter((token) =>
        commonSearchTypes.some(
          (type) =>
            token.startsWith(`color.${type}`) ||
            token.startsWith(`elevation.${type}`),
        ),
      )
    : activeTokens;
}

function tokenToVar(token: string) {
  return `--ds-${token
    .replace(/\./g, '-')
    .replace('color-', '')
    .replace('elevation-', '')}`;
}

export default function findToken(meta: string[]) {
  const filteredTokens = filterTokens(meta);
  const tokenFuzzySearch = Search(filteredTokens, false);
  const cleanSearchTerms = cleanMeta(meta).join(' ');
  const results: string[] = tokenFuzzySearch.get(cleanSearchTerms);

  if (!results || results.length === 0) {
    return 'MISSING_TOKEN';
  }

  const candidates = results.map((result) => result[1]);

  return tokenToVar(candidates[0]);
}
