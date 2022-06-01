import type { TransformedToken } from 'style-dictionary';

import atlassianLight from '../../src/artifacts/tokens-raw/atlassian-light';
import type { PaintToken, RawToken, ShadowToken } from '../../src/types';
import { getTokenId } from '../../src/utils/token-ids';

/**
 * Any tokens with paths beginning with these strings will be
 * added as subgroups to their parent tokens.
 */
const subgroups = [
  'color.text',
  'color.link',
  'color.icon',
  'color.border',
  'color.background',
  'color.blanket',
  'color.skeleton',
  'elevation.surface',
  'elevation.shadow',
];

/**
 * Any token paths that end in these strings will be added
 * to their base tokens under 'extensions'.
 *
 * @example 'color.background.neutral.bold.hovered' will be added to 'color.background.neutral.bold'
 */
const extensions = ['pressed', 'hovered'];

export interface TransformedTokenExtended extends TransformedToken {
  attributes:
    | (TransformedToken['attributes'] & PaintToken['attributes'])
    | ShadowToken['attributes']
    | RawToken['attributes'];
  extensions?: TransformedTokenExtended[];
}
export interface TokenGroup {
  name: string;
  tokens: TransformedTokenExtended[];
  subgroups?: TokenGroup[];
}

/**
 * Find matching token group based on token.
 */
const findGroup = (
  groups: TokenGroup[],
  token: TransformedTokenExtended,
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
  token: TransformedTokenExtended;
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

const sortBySemantics = (
  a: TransformedTokenExtended,
  b: TransformedTokenExtended,
) => {
  // Shortest paths ordered first
  if (a.path.length > b.path.length) {
    return 1;
  } else if (a.path.length < b.path.length) {
    return -1;
  }

  return 0;
};

const sortCustomOrder = (
  a: TransformedTokenExtended,
  b: TransformedTokenExtended,
) => {
  /**
   * Reorders Color > Link between Text and Border
   * - Color
   *   - Text
   *   - Link
   *   - Border
   */
  if (
    a.path[0] === 'color' &&
    b.path[0] === 'color' &&
    a.path[1] !== b.path[1]
  ) {
    if (a.path[1] !== 'border' && b.path[1] === 'link') {
      return 1;
    } else if (a.path[1] === 'link' && b.path[1] !== 'text') {
      return -1;
    }
  }

  /**
   * Reorders Elevation > Surface before Shadow
   * - Elevation
   *   - Surface
   *   - Shadow
   */
  if (
    a.path[0] === 'elevation' &&
    b.path[0] === 'elevation' &&
    a.path[1] !== b.path[1]
  ) {
    if (a.path[1] === 'shadow' && b.path[1] === 'surface') {
      return 1;
    } else if (a.path[1] === 'surface' && b.path[1] === 'shadow') {
      return -1;
    }
  }

  /**
   * Deleted Shadow group always goes last
   */
  if (a.path[0] === 'shadow') {
    return 1;
  } else if (b.path[0] === 'shadow') {
    return -1;
  }

  return 0;
};

const groupTokens = (tokens: TransformedToken[]) => {
  const filteredTokens = (tokens.filter(
    (token) => token.attributes && token.attributes.group !== 'palette',
  ) as TransformedTokenExtended[])
    .sort(sortBySemantics)
    .sort(sortCustomOrder);

  // Relocate extension tokens
  const extendedTokens = filteredTokens.filter((token) => {
    // Determine if this token is an extension
    const isExtension = extensions?.includes(token.path[token.path.length - 1]);

    if (isExtension) {
      const aggregateBase = getTokenId(
        token.path.slice(0, token.path.length - 1),
      );

      const baseToken = tokens.find(
        ({ name }) => aggregateBase === getTokenId(name),
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
    const name = getTokenId(token.name);

    const isSubgroup = subgroups.some((subgroup) => name.startsWith(subgroup));

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

const groupedTokens = groupTokens(atlassianLight);

export default groupedTokens;
