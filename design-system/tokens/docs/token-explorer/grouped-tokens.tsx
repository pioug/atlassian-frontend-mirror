import { tokenOrder } from '../../scripts/style-dictionary/sort-tokens';
import lightTheme from '../../src/artifacts/tokens-raw/atlassian-light';
import spacingTheme from '../../src/artifacts/tokens-raw/atlassian-spacing';
import { getTokenId } from '../../src/utils/token-ids';

import { mergeTokens } from './merged-tokens';
import type {
  TransformedTokenGrouped,
  TransformedTokenMerged,
  TransformedTokenWithAttributes,
} from './types';

/**
 * Any token paths that end in these strings will be added
 * to their base tokens under 'extensions'.
 *
 * @example 'color.background.neutral.bold.hovered' will be added to 'color.background.neutral.bold'
 */
const extensions = ['pressed', 'hovered'];

export interface TokenGroup {
  name: string;
  tokens: TransformedTokenGrouped[];
  subgroups?: TokenGroup[];
}

/**
 * Find matching token group based on token.
 */
const findGroup = (
  groups: TokenGroup[],
  token: TransformedTokenMerged,
  depth: number,
) => groups.find(({ name }) => name === token.path[depth - 1]);

/**
 * Add token to a group. Create new group if it does not exist.
 */
const addToGroup = ({
  groups,
  token,
  depth,
  offsetDepth,
  final,
}: {
  groups: TokenGroup[];
  token: TransformedTokenGrouped;
  depth: number;
  offsetDepth?: boolean;
  final?: boolean;
}) => {
  const actualDepth = offsetDepth ? depth + 1 : depth;

  let matchingGroup = findGroup(groups, token, actualDepth);

  // No matching group, create new one and add token
  if (!matchingGroup) {
    groups.push({
      name: token.path[actualDepth - 1],
      tokens: [],
      subgroups: depth === 1 ? [] : undefined,
    });
    matchingGroup = findGroup(groups, token, actualDepth);
  }

  if (final && matchingGroup) {
    matchingGroup.tokens.push(token);
  }

  return matchingGroup;
};

const groupTokens = (tokens: TransformedTokenMerged[]): TokenGroup[] => {
  // Relocate extension tokens
  const extendedTokens = tokens.filter((token) => {
    // Determine if this token is an extension
    const isExtension = extensions?.includes(token.path[token.path.length - 1]);

    if (isExtension) {
      const aggregateBase = getTokenId(
        token.path.slice(0, token.path.length - 1),
      );

      const baseToken = tokens.find(
        ({ nameClean }) => aggregateBase === nameClean,
      );

      if (baseToken && !baseToken?.extensions) {
        baseToken.extensions = [];
      }

      baseToken?.extensions?.push(token);
    }

    return !isExtension;
  });

  // Group tokens
  let groupedTokens: any[] = [];

  extendedTokens.forEach((token) => {
    const isSubgroup = tokenOrder.some(
      ({ path, subpaths }) =>
        token.path[0] === path && subpaths.includes(token.path[1]),
    );

    // Add to first level
    const groupLevel1 = addToGroup({
      groups: groupedTokens,
      token,
      depth: 1,
      final: !isSubgroup,
    });

    // Add subgroup
    if (groupLevel1 && isSubgroup) {
      addToGroup({
        groups: groupLevel1.subgroups!,
        token,
        depth: 2,
        final: true,
      });
    }
  });

  return groupedTokens;
};

const groupedTokens = groupTokens(
  mergeTokens([
    ...(lightTheme as TransformedTokenWithAttributes[]),
    ...(spacingTheme as TransformedTokenWithAttributes[]),
  ]),
);

export default groupedTokens;
