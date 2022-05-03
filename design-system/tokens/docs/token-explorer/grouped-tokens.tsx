import type { TransformedToken } from 'style-dictionary';

import atlassianLight from '../../src/artifacts/tokens-raw/atlassian-light';
import type { PaintToken, RawToken, ShadowToken } from '../../src/types';
import { getTokenId } from '../../src/utils/token-ids';

/**
 * Any tokens with paths beginning with these strings will be
 * added as subgroups to their parent tokens.
 */
const subgroups = [
  'color.text.accent',
  'color.icon.accent',
  'color.border.accent',
  'color.background.accent',
  'color.background.selected',
  'color.background.neutral',
  'color.background.input',
  'color.background.brand',
  'color.background.danger',
  'color.background.warning',
  'color.background.success',
  'color.background.discovery',
  'color.background.information',
  'elevation.surface',
  'elevation.shadow',
  'color.interaction.inverse',
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

const sortByState = (
  a: TransformedTokenExtended,
  b: TransformedTokenExtended,
) => {
  if (a.attributes.state === 'deleted' && b.attributes.state !== 'deleted') {
    return 1;
  }
  if (b.attributes.state === 'deleted' && a.attributes.state !== 'deleted') {
    return -1;
  }

  if (
    a.attributes.state === 'deprecated' &&
    b.attributes.state !== 'deprecated'
  ) {
    return 1;
  }
  if (
    b.attributes.state === 'deprecated' &&
    a.attributes.state !== 'deprecated'
  ) {
    return -1;
  }

  return 0;
};

const groupTokens = (tokens: TransformedToken[]) => {
  const filteredTokens = (tokens.filter(
    (token) => token.attributes && token.attributes.group !== 'palette',
  ) as TransformedTokenExtended[])
    // Sort by state
    .sort(sortByState);

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

    // Drop generic 'color' group
    const isColor = token.path.length > 0 && token.path[0] === 'color';

    const isSubgroup = subgroups.some((subgroup) => name.startsWith(subgroup));

    // Add to first level
    const groupLevel1 = addToGroup({
      groups: groupedTokens,
      token,
      depth: 1,
      offsetDepth: isColor,
      final: !isSubgroup,
    });

    // Add subgroup
    if (groupLevel1 && isSubgroup) {
      addToGroup({
        groups: groupLevel1.subgroups!,
        token,
        depth: 2,
        offsetDepth: isColor,
        final: true,
      });
    }
  });

  return groupedTokens;
};

const groupedTokens = groupTokens(atlassianLight);

export default groupedTokens;
